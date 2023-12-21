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

        public async Task<Account?> GetAccountByUsernameAsync(String username) {
            return await dbContext.Accounts.Where(a => a.Username == username).FirstOrDefaultAsync();
        }

        public async Task<Account?> AddAccountAsync(String username, String email, String password)
        {
            var account = new Account()
            {
                Id = Guid.NewGuid(),
                Username = username,
                Email = email,
                Password = password,
                Role = "user",
                DateCreated = DateTime.Now,
                LastEdited = DateTime.Now,
                NoteBooks = new List<NoteBook>()
            };
            await dbContext.Accounts.AddAsync(account);
            await dbContext.SaveChangesAsync();
            return account;
        }

        public async Task<Account?> UpdateAccountAsync(Guid id, String username, String email, String password)
        {
            var account = await dbContext.Accounts.FindAsync(id);
            if (account != null)
            {
                account.Username = username;
                account.Email = email;
                account.Password = password;
                account.LastEdited = DateTime.Now;
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