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
        public ICollection<Note>? Notes {get; set; } = new List<Note>();
        public Guid OwnerId { get; set; }
        public AccountDto Owner { get; set; } = null!;
    }
}