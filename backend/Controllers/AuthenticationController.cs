using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.DataProtection;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.OpenApi.Any;
using Microsoft.Extensions.Options;
using System.Net;
using backend.Configurations;
using System.Security.Cryptography.X509Certificates;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthenticationController : Controller
    {
        private readonly NotahAPIDbContext dbContext;
        private readonly IPasswordHasher passwordHasher;
        private readonly JWTConfig JWTConfig;

        public AuthenticationController(NotahAPIDbContext dbContext, IPasswordHasher passwordHasher, IOptionsMonitor<JWTConfig> optionsMonitor)
        {
            this.dbContext = dbContext;
            this.passwordHasher = passwordHasher;
            this.JWTConfig = optionsMonitor.CurrentValue;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginReqDto log)
        {
            var account = await dbContext.Accounts.Where(a => a.Username == log.Username).FirstOrDefaultAsync();
            if (account == null) {
                return NotFound();
            }
            var result = passwordHasher.Verify(account.Password, log.Password);
            if (!result) {
                return BadRequest();
            }
            GenerateJWTAccessToken(account);
            var refreshToken = GenerateRefreshToken();
            await SetRefreshToken(refreshToken, account);
            SetIdentifier(refreshToken);
            var accountDto = new AccountDto()
            {
                Id = account.Id,
                Username = account.Username,
                Email = account.Email,
                Role = account.Role,
                DateCreated = account.DateCreated.ToLocalTime().ToString("MM/dd/yyyy h:mm tt"),
                LastEdited = account.LastEdited.ToLocalTime().ToString("MM/dd/yyyy h:mm tt"),
                AIUsageLimit = account.AIUsageLimit
            };
            return Ok(accountDto);
        }

        [Authorize]
        [HttpPost]
        [Route("logout/{id:guid}")]
        public async Task<IActionResult> Logout([FromRoute] Guid id) {
            var account = await dbContext.Accounts.Where(a => a.Id == id).FirstOrDefaultAsync();
            if (account == null) {
                return NotFound();
            }
            if (HttpContext.Request.Cookies["accessToken"] != null) {
                HttpContext.Response.Cookies.Append("accessToken", "", 
                    new CookieOptions {
                        Expires = DateTime.UtcNow.AddDays(-1)
                    }
                );
            }
            if (HttpContext.Request.Cookies["refreshToken"] != null) {
                HttpContext.Response.Cookies.Append("refreshToken", "", 
                    new CookieOptions {
                        Expires = DateTime.UtcNow.AddDays(-1)
                    }
                );
            }
            if (HttpContext.Request.Cookies["identifier"] != null) {
                HttpContext.Response.Cookies.Append("identifier", "", 
                    new CookieOptions {
                        Expires = DateTime.UtcNow.AddDays(-1)
                    }
                );
            }
            account.RefreshToken = "";
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        private void GenerateJWTAccessToken(Account account) {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTConfig.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, account.Username),
                new Claim(ClaimTypes.Email, account.Email),
                new Claim(ClaimTypes.Role, account.Role),
                new Claim("AIUsageLimit", account.AIUsageLimit.ToString())
            };

            var token = new JwtSecurityToken(
                JWTConfig.Issuer,
                JWTConfig.Audience, 
                claims, 
                expires: DateTime.UtcNow.AddMinutes(15), 
                signingCredentials: credentials);
            
            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            SetJWTAccessToken(accessToken);
        }

        private static RefreshToken GenerateRefreshToken() {
            var refreshToken = new RefreshToken() {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            return refreshToken;
        }

        [HttpGet("refreshToken")]
        public async Task<IActionResult> RefreshToken() {
            var refreshToken = Request.Cookies["refreshToken"];
            var account = await dbContext.Accounts.Where(a => a.RefreshToken == refreshToken).FirstOrDefaultAsync();
            if (account == null) {
                return Unauthorized("Cannot refresh token");
            }
            if (account.TokenExpires < DateTime.UtcNow) {
                return Unauthorized("Token expired");
            }
            GenerateJWTAccessToken(account);
            var accountDto = new AccountDto()
                    {
                        Id = account.Id,
                        Username = account.Username,
                        Email = account.Email,
                        Role = account.Role,
                        AIUsageLimit = account.AIUsageLimit,
                        DateCreated = account.DateCreated.ToLocalTime().ToString("MM/dd/yyyy h:mm tt"),
                        LastEdited = account.LastEdited.ToLocalTime().ToString("MM/dd/yyyy h:mm tt"),
                    };
            return Ok(accountDto);
        }

        private async Task SetRefreshToken(RefreshToken refreshToken, Account account) {
            HttpContext.Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions {
                Expires = refreshToken.Expires.AddMinutes(-10),
                HttpOnly = true,
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None
            });
            account.RefreshToken = refreshToken.Token;
            account.DateCreated = refreshToken.Created;
            account.TokenExpires = refreshToken.Expires;
            await dbContext.SaveChangesAsync();

        }

        private void SetJWTAccessToken(string accessToken) {
            HttpContext.Response.Cookies.Append("accessToken", accessToken, 
                new CookieOptions {
                    Expires = DateTime.UtcNow.AddMinutes(14),
                    HttpOnly = true,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.None
            });
        }

        private void SetIdentifier(RefreshToken refreshToken) {
            HttpContext.Response.Cookies.Append("identifier", "true", 
                new CookieOptions {
                    Expires = refreshToken.Expires.AddMinutes(-10),
                    HttpOnly = false,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.None
                });
        }
    }
}