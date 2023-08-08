using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class NoteBook
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public ICollection<Note>? Notes {get; set; } = new List<Note>();
        public Guid OwnerId { get; set; }
        public Account Owner { get; set; } = null!;
    }
}