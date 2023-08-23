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
    public class CanvasElementRepository : ICanvasElementRepository
    {
        private readonly NotahAPIDbContext dbContext;

        public CanvasElementRepository(NotahAPIDbContext dbContext) {
            this.dbContext = dbContext;
        }

        public async Task<ICollection<CanvasElement>> GetAllCanvasElementsAsync()
        {
            return await dbContext.CanvasElements.ToListAsync();
        }

        public async Task<CanvasElement?> GetCanvasElementByIdAsync(Guid id)
        {
            return await dbContext.CanvasElements.Where(ce => ce.Id == id).FirstOrDefaultAsync();
        }

        public async Task<ICollection<CanvasElement>> GetCanvasElementsByPageIdAsync(Guid pageId)
        {
            return await dbContext.CanvasElements.Where(ce => ce.PageId == pageId).ToListAsync();
        }

        public async Task<CanvasElement?> AddCanvasElementAsync(Guid pageId, double x, double y, string html)
        {
            var page = await dbContext.Pages.FindAsync(pageId);
            if (page != null) {
                var canvasElement = new CanvasElement() {
                    Id = Guid.NewGuid(),
                    X = x,
                    Y = y,
                    HTML = html,
                    PageId = page.Id,
                    Page = page
                };
                await dbContext.CanvasElements.AddAsync(canvasElement);
                await dbContext.SaveChangesAsync();
                return canvasElement;
            }
            return null;
        }

        public async Task<CanvasElement?> UpdateCanvasElementAsync(Guid id, double x, double y, string html)
        {
            var canvasElement = await dbContext.CanvasElements.FindAsync(id);
            if (canvasElement != null) {
                canvasElement.X = x;
                canvasElement.Y = y;
                canvasElement.HTML = html;
                await dbContext.SaveChangesAsync();
            }
            return canvasElement;
        }

        public async Task<CanvasElement?> DeleteCanvasElementAsync(Guid id)
        {
            var canvasElement = await dbContext.CanvasElements.FindAsync(id);
            if (canvasElement != null) {
                dbContext.CanvasElements.Remove(canvasElement);
                await dbContext.SaveChangesAsync();
            }
            return canvasElement;
        }
    }
}