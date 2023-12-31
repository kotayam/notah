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
            GenerateToken(account);
            var accountDto = new AccountDto()
            {
                Id = account.Id,
                Username = account.Username,
                Email = account.Email,
                Role = account.Role,
                DateCreated = account.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                LastEdited = account.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                AIUsageLimit = account.AIUsageLimit
            };
            return Ok(accountDto);
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout() {
            if (HttpContext.Request.Cookies["accessToken"] != null) {
                HttpContext.Response.Cookies.Append("accessToken", "", 
                    new CookieOptions {
                        Expires = DateTime.Now.AddDays(-1)
                    }
                );
            }
            if (HttpContext.Request.Cookies["refreshToken"] != null) {
                HttpContext.Response.Cookies.Append("refreshToken", "", 
                    new CookieOptions {
                        Expires = DateTime.Now.AddDays(-1)
                    }
                );
            }
            return Ok();
        }

        private void GenerateToken(Account account) {
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
                expires: DateTime.Now.AddMinutes(15), 
                signingCredentials: credentials);
            
            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            HttpContext.Response.Cookies.Append("accessToken", accessToken, 
                new CookieOptions {
                    Expires = DateTime.Now.AddMinutes(14),
                    HttpOnly = true,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.None
            });
        }
    }
}