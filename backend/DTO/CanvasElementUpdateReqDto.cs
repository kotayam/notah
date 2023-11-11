using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class CanvasElementUpdateReqDto
    {
        public double X { get; set; }
        public double Y { get; set; }
        public string InnerHTML { get; set; } = "";
        public double Width { get; set; }
        public double Height {get; set; }
    }
}