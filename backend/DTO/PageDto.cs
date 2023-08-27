using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class PageDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string HTML { get; set; } = null!;
    }
}