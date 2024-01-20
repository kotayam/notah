using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTO;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly NotahAPIDbContext dbContext;
        private readonly IPasswordHasher passwordHasher;

        public AccountRepository(NotahAPIDbContext dbContext, IPasswordHasher passwordHasher)
        {
            this.dbContext = dbContext;
            this.passwordHasher = passwordHasher;
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
                AIUsageLimit = 10,
                DateCreated = DateTime.UtcNow,
                LastEdited = DateTime.UtcNow,
                NoteBooks = new List<NoteBook>()
            };
            await dbContext.Accounts.AddAsync(account);
            await dbContext.SaveChangesAsync();
            return account;
        }

        public async Task<Account?> UpdateAccountAsync(Guid id, String username, String email)
        {
            var account = await dbContext.Accounts.Where(a => a.Id == id).FirstOrDefaultAsync();
            if (account != null)
            {
                account.Username = username;
                account.Email = email;
                account.LastEdited = DateTime.UtcNow;
                await dbContext.SaveChangesAsync();
            }
            return account;
        }

        public async Task<Account?> ChangePasswordAsync(Guid id, string currPassword, string newPassword) {
            var account = await dbContext.Accounts.Where(a => a.Id == id).FirstOrDefaultAsync();
            if (account != null)
            {
                var result = passwordHasher.Verify(account.Password, currPassword);
                if (!result) {
                    throw new Exception("Incorrect password");
                }
                account.Password = passwordHasher.Hash(newPassword);
                account.LastEdited = DateTime.UtcNow;
                await dbContext.SaveChangesAsync();
            }
            return account;
        }

        public async Task<Account?> DecreaseAIUsageAsync(Guid id) {
            var account = await dbContext.Accounts.Where(a => a.Id == id).FirstOrDefaultAsync();
            if (account != null) {
                account.AIUsageLimit--;
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