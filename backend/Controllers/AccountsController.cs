using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTO;
using backend.Interfaces;
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
        private readonly IAccountRepository accountRepository;
        public AccountsController(IAccountRepository accountRepository)
        {
            this.accountRepository = accountRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAccounts()
        {
            return Ok(await accountRepository.GetAllAccountsAsync());
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetAccount([FromRoute] Guid id)
        {
            var account = await accountRepository.GetAccountAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            return Ok(account);
        }

        [HttpPost]
        public async Task<IActionResult> AddAccount(AccountDto accountDto)
        {
            await accountRepository.AddAccountAsync(accountDto);
            return Ok(accountDto);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateAccount([FromRoute] Guid id, AccountDto accountDto)
        {
            var account = await accountRepository.UpdateAccountAsync(id, accountDto);

            if (account != null)
            {
                return Ok(accountDto);
            }
            return NotFound();
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteAccount([FromRoute] Guid id)
        {
            var account = await accountRepository.DeleteAccountAsync(id);

            if (account != null)
            {
                return Ok(account);
            }

            return NotFound();
        }
    }
}