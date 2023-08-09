using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IPageRepository
    {
        Task<ICollection<Page>> GetAllPagesAsync();
        Task<Page?> GetPageByIdAsync(Guid id);
        Task<ICollection<Page>> GetPagesByNoteBookIdAsync(Guid noteBookId);
        Task<Page?> AddPageAsync(Guid noteBookId, String title);
        Task<Page?> UpdatePageAsync(Guid id, String title);
        Task<Page?> DeletePageAsync(Guid id);
    }
}