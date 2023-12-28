using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class AIPromptResDto
    {
        public string Answer {get; set;} = "";
        public int AIUsageLimit {get; set;}
    }
}