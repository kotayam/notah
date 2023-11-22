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
        public DateTime DateCreated {get; set;}
        public DateTime LastEdited {get; set;}
        public ICollection<Page>? Pages {get; set; } = new List<Page>();
        public Guid OwnerId { get; set; }
        public Account Owner { get; set; } = null!;
    }
}