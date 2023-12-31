using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class AccountPasswordReqDto
    {
        public string currPassword {get; set;} = "";
        public string newPassword {get; set;} = "";
    }
}