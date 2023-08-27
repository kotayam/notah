using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class PageDetailsDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public ICollection<CanvasElementDto> CanvasElements { get; set; } = new List<CanvasElementDto>();
        public string HTML { get; set; } = "";
        public Guid NoteBookId { get; set; }
    }
}