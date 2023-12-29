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
        Task<CanvasElement?> AddCanvasElementAsync(Guid pageId, string type, double x, double y, string innerHtml, string font, int fontSize, string FontColor, string shape, double width, double height, int row, int col);
        Task<CanvasElement?> UpdateCanvasElementAsync(Guid id, double x, double y, string innerHtml, double width, double height);
        Task<CanvasElement?> DeleteCanvasElementAsync(Guid id);
    }
}