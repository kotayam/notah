using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Page
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public DateTime DateCreated {get; set;}
        public DateTime LastEdited {get; set;}
        public ICollection<CanvasElement> CanvasElements { get; set; } = new List<CanvasElement>();
        public Guid NoteBookId { get; set; }
        public NoteBook NoteBook { get; set; } = null!;
    }
}