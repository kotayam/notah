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

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class LoginController : Controller
    {
        private readonly NotahAPIDbContext dbContext;
        private IConfigurationRoot config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: false)
            .Build();

        public LoginController(NotahAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginReqDto log)
        {
            var account = await dbContext.Accounts.Where(a => a.Email == log.Email && a.Password == log.Password).FirstOrDefaultAsync();
            if (account != null)
            {
                var token = Generate(account);
                var accountDto = new AccountDto()
                {
                    Id = account.Id,
                    Username = account.Username,
                    Email = account.Email,
                    Password = account.Password,
                    AccessToken = token
                };
                return Ok(accountDto);
            }
            return NotFound("Account not found");
        }

        private string Generate(Account account) {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, account.Username),
                new Claim(ClaimTypes.Email, account.Email)
            };

            var token = new JwtSecurityToken(config["Jwt:Issuer"], 
                config["Jwt:Audience"], 
                claims, 
                expires: DateTime.Now.AddMinutes(15), 
                signingCredentials: credentials);
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}