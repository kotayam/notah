using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class CanvasElementDto
    {
        public Guid Id { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public string HTML { get; set; } = "";
        public Guid PageId  { get; set; }
    }
}