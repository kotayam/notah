using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTO;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Repository;

namespace backend.Repository
{
    public class NoteBookRepository : INoteBookRepository
    {
        private readonly NotahAPIDbContext dbContext;

        public NoteBookRepository(NotahAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<ICollection<NoteBook>> GetAllNoteBooksAsync()
        {
            return await dbContext.NoteBooks.Include(nb => nb.Pages).OrderBy(nb => nb.DateCreated).ToListAsync();
        }

        public async Task<NoteBook?> GetNoteBookByIdAsync(Guid id)
        {
            return await dbContext.NoteBooks.Include(nb => nb.Pages).Where(nb => nb.Id == id).FirstOrDefaultAsync();
        }
        public async Task<ICollection<NoteBook>> GetNoteBooksByOwnerIdAsync(Guid ownerId)
        {
            return await dbContext.NoteBooks.Include(nb => nb.Pages).Where(nb => nb.OwnerId == ownerId).OrderBy(nb => nb.DateCreated).ToListAsync();
        }
        public async Task<NoteBook?> AddNoteBookAsync(Guid ownerId, String title)
        {
            var owner = await dbContext.Accounts.FindAsync(ownerId);
            if (owner != null)
            {
                var noteBook = new NoteBook()
                {
                    Id = Guid.NewGuid(),
                    Title = title,
                    DateCreated = DateTime.Now,
                    LastEdited = DateTime.Now,
                    OwnerId = owner.Id,
                    Owner = owner
                };
                await dbContext.NoteBooks.AddAsync(noteBook);
                await dbContext.SaveChangesAsync();
                return noteBook;
            }
            return null;
        }

        public async Task<NoteBook?> UpdateNoteBookAsync(Guid id, String title)
        {
            var noteBook = await dbContext.NoteBooks.FindAsync(id);
            if (noteBook != null) {
                noteBook.Title = title;
                noteBook.LastEdited = DateTime.Now;
                await dbContext.SaveChangesAsync();
            }
            return noteBook;
        }

        public async Task<NoteBook?> DeleteNoteBookAsync(Guid id)
        {
            var noteBook = await dbContext.NoteBooks.Include(nb => nb.Pages).Where(nb => nb.Id == id).FirstOrDefaultAsync();
            if (noteBook != null) {
                dbContext.NoteBooks.Remove(noteBook);
                await dbContext.SaveChangesAsync();
            }
            return noteBook;
        }
    }
}