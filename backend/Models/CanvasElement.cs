using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class CanvasElement
    {
        public Guid Id { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
    }
}