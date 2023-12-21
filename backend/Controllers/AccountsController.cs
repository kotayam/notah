using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTO;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
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
        private readonly INoteBookRepository noteBookRepository;
        private readonly IPageRepository pageRepository;
        private readonly IPasswordHasher passwordHasher;

        public AccountsController(IAccountRepository accountRepository, INoteBookRepository noteBookRepository, IPageRepository pageRepository, IPasswordHasher passwordHasher)
        {
            this.accountRepository = accountRepository;
            this.noteBookRepository = noteBookRepository;
            this.pageRepository = pageRepository;
            this.passwordHasher = passwordHasher;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAccounts()
        {
            var accounts = await accountRepository.GetAllAccountsAsync();
            var accountsDto = from a in accounts
                              select new AccountDetailsDto()
                              {
                                  Id = a.Id,
                                  Username = a.Username,
                                  Email = a.Email,
                                  Password = a.Password,
                                  Role = a.Role,
                                  DateCreated = a.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                                  LastEdited = a.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
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
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetAccountById([FromRoute] Guid id)
        {
            var account = await accountRepository.GetAccountByIdAsync(id);
            if (account != null)
            {
                var accountDetailsDto = new AccountDetailsDto()
                {
                    Id = account.Id,
                    Username = account.Username,
                    Email = account.Email,
                    Password = account.Password,
                    Role = account.Role,
                    DateCreated = account.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastEdited = account.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
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

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AddAccount([FromBody] AccountReqDto acc)
        {
            var exist = await accountRepository.GetAccountByUsernameAsync(acc.Username);
            if (exist != null) {
                return BadRequest();
            }
            var passwordHash = passwordHasher.Hash(acc.Password);
            var account = await accountRepository.AddAccountAsync(acc.Username, acc.Email, passwordHash);
            if (account == null) {
                return NotFound();
            }
            var noteBook = await noteBookRepository.AddNoteBookAsync(account.Id, "Quick Notes");
            if (noteBook != null) {
                var page = await pageRepository.AddPageAsync(noteBook.Id, "Unititled");
                if (page != null) {
                    var accountDto = new AccountDto()
                    {
                        Id = account.Id,
                        Username = acc.Username,
                        Email = acc.Email,
                        Password = passwordHash,
                        Role = account.Role,
                        DateCreated = account.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                        LastEdited = account.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                    };
                    return Ok(accountDto);
                }
            }
            return NotFound();
        }

        [HttpPut]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateAccount([FromRoute] Guid id, [FromBody] AccountReqDto acc)
        {
            var account = await accountRepository.UpdateAccountAsync(id, acc.Username, acc.Email, acc.Password);

            if (account != null)
            {
                var accountDto = new AccountDto()
                {
                    Id = account.Id,
                    Username = acc.Username,
                    Email = acc.Email,
                    Password = acc.Password,
                    Role = account.Role,
                    DateCreated = account.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastEdited = account.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                };
                return Ok(accountDto);
            }
            return NotFound();
        }

        [HttpDelete]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteAccount([FromRoute] Guid id)
        {
            var account = await accountRepository.DeleteAccountAsync(id);

            if (account != null)
            {
                var accountDto = new AccountDto()
                {
                    Id = account.Id,
                    Username = account.Username,
                    Email = account.Email,
                    Password = account.Password,
                    Role = account.Role,
                    DateCreated = account.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastEdited = account.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                };
                return Ok(accountDto);
            }

            return NotFound();
        }
    }
}