using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTO;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class AccountRepository: IAccountRepository
    {
        private readonly NotahAPIDbContext dbContext;

        public AccountRepository(NotahAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<ICollection<Account>> GetAllAccountsAsync() {
            return await dbContext.Accounts.Include(a => a.NoteBooks).ToListAsync();
        }

        public async Task<Account?> GetAccountAsync(Guid id) {
            return await dbContext.Accounts.Include(a => a.NoteBooks).Where(a => a.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Account?> AddAccountAsync(AccountDto accountDto) {
            var account = new Account() {
                Id = Guid.NewGuid(),
                FullName = accountDto.FullName,
                Email = accountDto.Email,
                Password = accountDto.Password,
                NoteBooks = new List<NoteBook>()
            };
            await dbContext.Accounts.AddAsync(account);
            await dbContext.SaveChangesAsync();
            return account;
        }

        public async Task<Account?> UpdateAccountAsync(Guid id, AccountDto accountDto) {
            var acc = await dbContext.Accounts.FindAsync(id);
            if (acc != null) {
                acc.FullName = accountDto.FullName;
                acc.Email = accountDto.Email;
                acc.Password = accountDto.Password;
                await dbContext.SaveChangesAsync();
            }
            return acc;
        }

        public async Task<Account?> DeleteAccountAsync(Guid id) {
            var account = await dbContext.Accounts.FindAsync(id);
            if (account != null) {
                dbContext.Accounts.Remove(account);
                await dbContext.SaveChangesAsync();
            }
            return account;
        }
    }
}