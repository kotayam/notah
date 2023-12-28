using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class AccountDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role {get; set;} = null!;
        public int AIUsageLimit {get; set;}
        public string DateCreated {get; set;} = null!;
        public string LastEdited {get; set;} = null!;
    }
}