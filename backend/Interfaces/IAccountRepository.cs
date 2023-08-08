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
        Task<Account?> GetAccountAsync(Guid id);
        Task<Account?> AddAccountAsync(AccountDto accountDto);
        Task<Account?> UpdateAccountAsync(Guid id, AccountDto accountDto);
        Task<Account?> DeleteAccountAsync(Guid id);
    }
}