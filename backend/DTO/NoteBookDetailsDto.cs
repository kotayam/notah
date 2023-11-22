using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.DTO
{
    public class NoteBookDetailsDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string DateCreated {get; set;} = null!;
        public string LastEdited {get; set;} = null!;
        public ICollection<PageDto>? Pages { get; set; } = new List<PageDto>();
        public Guid OwnerId { get; set; }
    }
}