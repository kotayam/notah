using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MailData
    {
        public string EmailToAddress { get; set; } = "";
        public string EmailToName { get; set; } = "";
        public string EmailSubject { get; set; } = "";
        public string EmailBody { get; set; } = "";
    }
}