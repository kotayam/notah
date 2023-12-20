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

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class LoginController : Controller
    {
        private readonly NotahAPIDbContext dbContext;
        private readonly IPasswordHasher passwordHasher;
        private IConfigurationRoot config = new ConfigurationBuilder().AddJsonFile("appsettings.json", optional: false).Build();

        public LoginController(NotahAPIDbContext dbContext, IPasswordHasher passwordHasher)
        {
            this.dbContext = dbContext;
            this.passwordHasher = passwordHasher;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginReqDto log)
        {
            var account = await dbContext.Accounts.Where(a => a.Email == log.Email).FirstOrDefaultAsync();
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
                Password = account.Password
            };
            return Ok(accountDto);
        }

        private void GenerateToken(Account account) {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, account.Username),
                new Claim(ClaimTypes.Email, account.Email)
            };

            var token = new JwtSecurityToken(
                config["Jwt:Issuer"],
                config["Jwt:Audience"], 
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