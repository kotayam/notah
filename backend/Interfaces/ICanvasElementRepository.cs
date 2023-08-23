using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface ICanvasElementRepository
    {
        Task<ICollection<CanvasElement>> GetAllCanvasElementsAsync();
        Task<CanvasElement?> GetCanvasElementByIdAsync(Guid id);
        Task<ICollection<CanvasElement>> GetCanvasElementsByPageIdAsync(Guid pageId);
        Task<CanvasElement?> AddCanvasElementAsync(Guid pageId, double x, double y, string html);
        Task<CanvasElement?> UpdateCanvasElementAsync(Guid id, double x, double y, string html);
        Task<CanvasElement?> DeleteCanvasElementAsync(Guid id);
    }
}