using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class AccountDetailsDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string DateCreated {get; set;} = null!;
        public string LastEdited {get; set;} = null!;
        public ICollection<NoteBookDto> NoteBooks { get; set; } = new List<NoteBookDto>();
    }
}