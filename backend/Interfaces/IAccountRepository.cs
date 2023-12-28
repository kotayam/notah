using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;
using backend.Models;

namespace backend.Interfaces
{
    public interface IAccountRepository
    {
        Task<ICollection<Account>> GetAllAccountsAsync();
        Task<Account?> GetAccountByIdAsync(Guid id);
        Task<Account?> GetAccountByUsernameAsync(String username);
        Task<Account?> AddAccountAsync(String username, String email, String password);
        Task<Account?> UpdateAccountAsync(Guid id, String username, String email, String password);
        Task<Account?> DecreaseAIUsageAsync(Guid id);
        Task<Account?> DeleteAccountAsync(Guid id);
    }
}