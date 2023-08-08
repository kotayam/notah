using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Note
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public ICollection<CanvasElement> CanvasElements { get; set; } = new List<CanvasElement>();
        public NoteBook NoteBook { get; set; } = null!;
    }
}