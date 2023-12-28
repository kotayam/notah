using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Configurations
{
    public class JWTConfig
    {
        public string Key {get; set;} = "";
        public string Audience {get; set;} = "";
        public string Issuer {get; set;} = "";
    }
}