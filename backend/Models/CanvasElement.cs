using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace backend.Models
{
    public class CanvasElement
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = "";
        public double X { get; set; }
        public double Y { get; set; }
        public string InnerHTML { get; set;} = "";
        public string Font { get; set; } = "";
        public int FontSize { get; set; }
        public string FontColor { get; set; } = "";
        public string Shape { get; set; } = "";
        public double Width { get; set; }
        public double Height { get; set; }
        public int Row {get; set; }
        public int Column {get; set; }
        public bool Generated {get; set;}
        public Guid PageId { get; set; }
        public Page Page { get; set; } = null!;
    }
}