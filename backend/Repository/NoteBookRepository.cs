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

        public async Task<ICollection<NoteBook>> GetAllNoteBooksAsync() {
            return await dbContext.NoteBooks.Include(nb => nb.Owner).ToListAsync();
        }

        public async Task<NoteBook?> GetNoteBookByIdAsync(Guid id) {
            return await dbContext.NoteBooks.Include(nb => nb.Owner).Where(nb => nb.Id == id).FirstOrDefaultAsync();
        }
        public async Task<ICollection<NoteBook>> GetNoteBooksByOwnerIdAsync(Guid ownerId) {
            return await dbContext.NoteBooks.Include(nb => nb.Owner).Where(nb => nb.OwnerId == ownerId).ToListAsync();
        }
        public async Task<NoteBook?> AddNoteBookAsync(Guid ownerId, NoteBookDto noteBookDto) {
            var owner = await dbContext.Accounts.FindAsync(ownerId);
            if (owner != null) {
                var noteBook = new NoteBook() {
                    Id = Guid.NewGuid(),
                    Title = noteBookDto.Title,
                    OwnerId = owner.Id,
                    Owner = owner
                };
                await dbContext.NoteBooks.AddAsync(noteBook);
                await dbContext.SaveChangesAsync();
                return noteBook;
            }
            return null;
        }
    }
}