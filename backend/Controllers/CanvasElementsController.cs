using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CanvasElementsController : Controller
    {
        private readonly ICanvasElementRepository canvasElementRepository;

        public CanvasElementsController(ICanvasElementRepository canvasElementRepository)
        {
            this.canvasElementRepository = canvasElementRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCanvasElements()
        {
            var canvasElts = await canvasElementRepository.GetAllCanvasElementsAsync();
            var canvasEltsDto = from ce in canvasElts
                           select new CanvasElementDto()
                           {
                               Id = ce.Id,
                               Type = ce.Type,
                               X = ce.X,
                               Y = ce.Y,
                               InnerHTML = ce.InnerHTML,
                               Font = ce.Font,
                               FontSize = ce.FontSize,
                               FontColor = ce.FontColor,
                               Shape = ce.Shape,
                               Width = ce.Width,
                               Height = ce.Height,
                               Row = ce.Row,
                               Column = ce.Column,
                               PageId = ce.PageId
                           };
            return Ok(canvasEltsDto);
        }

        [HttpGet]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetCanvasElementById([FromRoute] Guid id)
        {
            var canvasElt = await canvasElementRepository.GetCanvasElementByIdAsync(id);
            if (canvasElt != null)
            {
                var canvasEltDto = new CanvasElementDto()
                {
                    Id = canvasElt.Id,
                    Type = canvasElt.Type,
                    X = canvasElt.X,
                    Y = canvasElt.Y,
                    InnerHTML = canvasElt.InnerHTML,
                    Font = canvasElt.Font,
                    FontSize = canvasElt.FontSize,
                    FontColor = canvasElt.FontColor,
                    Shape = canvasElt.Shape,
                    Width = canvasElt.Width,
                    Height = canvasElt.Height,
                    Row = canvasElt.Row,
                    Column = canvasElt.Column,
                    PageId = canvasElt.PageId
                };
                return Ok(canvasEltDto);
            }
            return NotFound();

        }

        [HttpGet]
        [Authorize]
        [Route("byPageId/{pageId:guid}")]
        public async Task<IActionResult> GetCanvasElementsByPageId([FromRoute] Guid pageId)
        {
            var canvasElts = await canvasElementRepository.GetCanvasElementsByPageIdAsync(pageId);
            var canvasEltsDto = from ce in canvasElts
                           select new CanvasElementDto()
                           {
                               Id = ce.Id,
                               Type = ce.Type,
                               X = ce.X,
                               Y = ce.Y,
                               InnerHTML = ce.InnerHTML,
                               Font = ce.Font,
                               FontSize = ce.FontSize,
                               FontColor = ce.FontColor,
                               Shape = ce.Shape,
                               Width = ce.Width,
                               Height = ce.Height,
                               Row = ce.Row,
                               Column = ce.Column,
                               PageId = ce.PageId
                           };
            return Ok(canvasEltsDto);
        }

        [HttpPost]
        [Authorize]
        [Route("{pageId:guid}")]
        public async Task<IActionResult> AddCanvasElement([FromRoute] Guid pageId, [FromBody] CanvasElementReqDto ce)
        {
            var exist = await canvasElementRepository.GetCanvasElementByIdAsync(ce.Id);
            if (exist != null) {
                return await UpdateCanvasElement(ce.Id, ce);
            }
            var canvasElt = await canvasElementRepository.AddCanvasElementAsync(pageId, ce.Type, ce.X, ce.Y, ce.InnerHTML, ce.Font, ce.FontSize, ce.FontColor, ce.Shape, ce.Width, ce.Height, ce.Row, ce.Column);
            if (canvasElt != null)
            {
                var canvasEltDto = new CanvasElementDto()
                {
                    Id = canvasElt.Id,
                    Type = canvasElt.Type,
                    X = canvasElt.X,
                    Y = canvasElt.Y,
                    InnerHTML = canvasElt.InnerHTML,
                    Font = canvasElt.Font,
                    FontSize = canvasElt.FontSize,
                    FontColor = canvasElt.FontColor,
                    Shape = canvasElt.Shape,
                    Width = canvasElt.Width,
                    Height = canvasElt.Height,
                    Row = canvasElt.Row,
                    Column = canvasElt.Column,
                    PageId = canvasElt.PageId
                };
                return Ok(canvasEltDto);
            }
            return NotFound();
        }

        [HttpPut]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateCanvasElement([FromRoute] Guid id, [FromBody] CanvasElementReqDto ce)
        {
            var canvasElt = await canvasElementRepository.UpdateCanvasElementAsync(id, ce.X, ce.Y, ce.InnerHTML, ce.Width, ce.Height);
            if (canvasElt != null)
            {
                var cavnasEltDto = new CanvasElementDto()
                {
                    Id = canvasElt.Id,
                    Type = canvasElt.Type,
                    X = canvasElt.X,
                    Y = canvasElt.Y,
                    InnerHTML = canvasElt.InnerHTML,
                    Font = canvasElt.Font,
                    FontSize = canvasElt.FontSize,
                    FontColor = canvasElt.FontColor,
                    Shape = canvasElt.Shape,
                    Width = canvasElt.Width,
                    Height = canvasElt.Height,
                    Row = canvasElt.Row,
                    Column = canvasElt.Column,
                    PageId = canvasElt.PageId
                };
                return Ok(cavnasEltDto);
            }
            return NotFound();
        }

        [HttpDelete]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteCanvasElement([FromRoute] Guid id)
        {
            var canvasElt = await canvasElementRepository.DeleteCanvasElementAsync(id);
            if (canvasElt != null)
            {
                var canvasEltDto = new CanvasElementDto()
                {
                    Id = canvasElt.Id,
                    Type = canvasElt.Type,
                    X = canvasElt.X,
                    Y = canvasElt.Y,
                    InnerHTML = canvasElt.InnerHTML,
                    Font = canvasElt.Font,
                    FontSize = canvasElt.FontSize,
                    FontColor = canvasElt.FontColor,
                    Shape = canvasElt.Shape,
                    Width = canvasElt.Width,
                    Height = canvasElt.Height,
                    Row = canvasElt.Row,
                    Column = canvasElt.Column,
                    PageId = canvasElt.PageId
                };
                return Ok(canvasEltDto);
            }
            return NotFound();
        }
    }
}