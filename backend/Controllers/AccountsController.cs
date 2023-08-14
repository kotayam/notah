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
            var accounts = await accountRepository.GetAllAccountsAsync();
            var accountsDto = from a in accounts
                              select new AccountDetailsDto()
                              {
                                  Id = a.Id,
                                  FullName = a.FullName,
                                  Email = a.Email,
                                  Password = a.Password,
                                  NoteBooks = (from nb in a.NoteBooks
                                               select new NoteBookDto()
                                               {
                                                   Id = nb.Id,
                                                   Title = nb.Title
                                               }).ToList()
                              };
            return Ok(accountsDto);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetAccountById([FromRoute] Guid id)
        {
            var account = await accountRepository.GetAccountByIdAsync(id);
            if (account != null)
            {
                var accountDetailsDto = new AccountDetailsDto()
                {
                    Id = account.Id,
                    FullName = account.FullName,
                    Email = account.Email,
                    Password = account.Password,
                    NoteBooks = (from nb in account.NoteBooks
                                 select new NoteBookDto()
                                 {
                                     Id = nb.Id,
                                     Title = nb.Title
                                 }).ToList()
                };
                return Ok(accountDetailsDto);
            }
            return NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> AddAccount([FromBody] AccountReqDto acc)
        {
            var account = await accountRepository.AddAccountAsync(acc.FullName, acc.Email, acc.Password);
            if (account != null)
            {
                var accountDto = new AccountDto()
                {
                    Id = account.Id,
                    FullName = acc.FullName,
                    Email = acc.Email,
                    Password = acc.Password
                };
                return Ok(accountDto);
            }
            return NotFound();
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateAccount([FromRoute] Guid id, [FromBody] AccountReqDto acc)
        {
            var account = await accountRepository.UpdateAccountAsync(id, acc.FullName, acc.Email, acc.Password);

            if (account != null)
            {
                var accountDto = new AccountDto()
                {
                    Id = account.Id,
                    FullName = acc.FullName,
                    Email = acc.Email,
                    Password = acc.Password
                };
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