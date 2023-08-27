using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class PageRepository : IPageRepository
    {
        private readonly NotahAPIDbContext dbContext;

        public PageRepository(NotahAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<ICollection<Page>> GetAllPagesAsync()
        {
            return await dbContext.Pages.Include(p => p.NoteBook).ToListAsync();
        }

        public async Task<Page?> GetPageByIdAsync(Guid id)
        {
            return await dbContext.Pages.Include(p => p.NoteBook).Where(p => p.Id == id).FirstOrDefaultAsync();
        }
        public async Task<ICollection<Page>> GetPagesByNoteBookIdAsync(Guid noteBookId)
        {
            return await dbContext.Pages.Include(p => p.NoteBook).Where(p => p.NoteBookId == noteBookId).ToListAsync();
        }
        public async Task<Page?> AddPageAsync(Guid noteBookId, String title)
        {
            var noteBook = await dbContext.NoteBooks.FindAsync(noteBookId);
            if (noteBook != null)
            {
                var page = new Page()
                {
                    Id = Guid.NewGuid(),
                    Title = title,
                    NoteBookId = noteBook.Id,
                    NoteBook = noteBook
                };
                await dbContext.Pages.AddAsync(page);
                await dbContext.SaveChangesAsync();
                return page;
            }
            return null;
        }

        public async Task<Page?> UpdatePageAsync(Guid id, String title, String html)
        {
            var page = await dbContext.Pages.FindAsync(id);
            if (page != null)
            {
                if (title != "") {
                    page.Title = title;
                }
                if (html != "") {
                    page.HTML = html;
                }
                await dbContext.SaveChangesAsync();
            }
            return page;
        }

        public async Task<Page?> DeletePageAsync(Guid id)
        {
            var page = await dbContext.Pages.Include(n => n.CanvasElements).Where(n => n.Id == id).FirstOrDefaultAsync();
            if (page != null)
            {
                dbContext.Pages.Remove(page);
                await dbContext.SaveChangesAsync();
            }
            return page;
        }
    }
}