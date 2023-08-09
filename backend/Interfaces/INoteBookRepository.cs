using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;
using backend.Models;

namespace backend.Interfaces
{
    public interface INoteBookRepository
    {
        Task<ICollection<NoteBook>> GetAllNoteBooksAsync();
        Task<NoteBook?> GetNoteBookByIdAsync(Guid id);
        Task<ICollection<NoteBook>> GetNoteBooksByOwnerIdAsync(Guid ownerId);
        Task<NoteBook?> AddNoteBookAsync(Guid ownerId, String title);
        Task<NoteBook?> UpdateNoteBookAsync(Guid id, String title);
        Task<NoteBook?> DeleteNoteBookAsync(Guid id);
    }
}