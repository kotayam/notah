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

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class LoginController : Controller
    {
        private readonly NotahAPIDbContext dbContext;

        public LoginController(NotahAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginReqDto log)
        {
            var account = await dbContext.Accounts.Where(a => a.Email == log.Email && a.Password == log.Password).FirstOrDefaultAsync();
            if (account != null)
            {
                var accountDto = new AccountDto()
                {
                    Id = account.Id,
                    FullName = account.FullName,
                    Email = account.Email,
                    Password = account.Password
                };
                return Ok(accountDto);
            }
            return NotFound();
        }
    }
}