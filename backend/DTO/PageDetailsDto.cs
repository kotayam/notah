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
        public string DateCreated {get; set;} = null!;
        public string LastEdited {get; set;} = null!;
        public ICollection<CanvasElementDto> CanvasElements { get; set; } = new List<CanvasElementDto>();
        public Guid NoteBookId { get; set; }
    }
}