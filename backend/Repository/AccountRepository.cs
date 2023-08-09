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
    public class AccountRepository : IAccountRepository
    {
        private readonly NotahAPIDbContext dbContext;

        public AccountRepository(NotahAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<ICollection<Account>> GetAllAccountsAsync()
        {
            return await dbContext.Accounts.Include(a => a.NoteBooks).ToListAsync();
        }

        public async Task<Account?> GetAccountByIdAsync(Guid id)
        {
            return await dbContext.Accounts.Include(a => a.NoteBooks).Where(a => a.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Account?> AddAccountAsync(String fullName, String email, String password)
        {
            var account = new Account()
            {
                Id = Guid.NewGuid(),
                FullName = fullName,
                Email = email,
                Password = password,
                NoteBooks = new List<NoteBook>()
            };
            await dbContext.Accounts.AddAsync(account);
            await dbContext.SaveChangesAsync();
            return account;
        }

        public async Task<Account?> UpdateAccountAsync(Guid id, String fullName, String email, String password)
        {
            var account = await dbContext.Accounts.FindAsync(id);
            if (account != null)
            {
                account.FullName = fullName;
                account.Email = email;
                account.Password = password;
                await dbContext.SaveChangesAsync();
            }
            return account;
        }

        public async Task<Account?> DeleteAccountAsync(Guid id)
        {
            var account = await dbContext.Accounts.Include(a => a.NoteBooks).Where(a => a.Id == id).FirstOrDefaultAsync();
            if (account != null)
            {
                dbContext.Accounts.Remove(account);
                await dbContext.SaveChangesAsync();
            }
            return account;
        }
    }
}