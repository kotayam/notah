using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class LoginReqDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}