using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Account
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role {get; set;} = null!;
        public int AIUsageLimit {get; set;}
        public DateTime DateCreated {get; set;}
        public DateTime LastEdited {get; set;}
        public string RefreshToken {get; set;} = "";
        public DateTime TokenCreated {get; set;}
        public DateTime TokenExpires {get; set;}
        public ICollection<NoteBook> NoteBooks { get; set; } = new List<NoteBook>();
    }
}