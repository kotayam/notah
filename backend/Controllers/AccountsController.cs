using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AccountsController : Controller
    {
        private readonly NotahAPIDbContext dbContext;
        public AccountsController(NotahAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAccounts() {
            return Ok(await dbContext.Accounts.ToListAsync());
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetAccount([FromRoute] Guid id) {
            var account = await dbContext.Accounts.FindAsync(id);
            if (account == null) {
                return NotFound();
            }
            return Ok(account);
        }

        [HttpPost]
        public async Task<IActionResult> AddAccount(AddAccountRequest addAccountRequest) {
            var account = new Account() {
                Id = Guid.NewGuid(),
                FullName = addAccountRequest.FullName,
                Email = addAccountRequest.Email,
                Password = addAccountRequest.Password,
                NoteBooks = new List<NoteBook>()
            };

            await dbContext.Accounts.AddAsync(account);
            await dbContext.SaveChangesAsync();

            return Ok(account);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateAccount([FromRoute] Guid id, UpdateAccountRequest updateAccountRequest) {
            var account = await dbContext.Accounts.FindAsync(id);
            
            if (account != null) {
                account.FullName = updateAccountRequest.FullName;
                account.Email = updateAccountRequest.Email;
                account.Password = updateAccountRequest.Password;

                await dbContext.SaveChangesAsync();
                return Ok(account);
            }
            return NotFound();
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteAccount([FromRoute] Guid id) {
            var account = await dbContext.Accounts.FindAsync(id);

            if (account != null) {
                dbContext.Accounts.Remove(account);
                await dbContext.SaveChangesAsync();

                return Ok(account);
            }

            return NotFound();
        }
    }
}