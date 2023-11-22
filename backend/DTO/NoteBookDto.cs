using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class NoteBookDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string DateCreated {get; set;} = null!;
        public string LastEdited {get; set;} = null!;
    }
}