using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;
using backend.Interfaces;
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
                               X = ce.X,
                               Y = ce.Y,
                               HTML = ce.HTML,
                               PageId = ce.PageId
                           };
            return Ok(canvasEltsDto);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetCanvasElementById([FromRoute] Guid id)
        {
            var canvasElt = await canvasElementRepository.GetCanvasElementByIdAsync(id);
            if (canvasElt != null)
            {
                var canvasEltDto = new CanvasElementDto()
                {
                    Id = canvasElt.Id,
                    X = canvasElt.X,
                    Y = canvasElt.Y,
                    HTML = canvasElt.HTML,
                    PageId = canvasElt.PageId
                };
                return Ok(canvasEltDto);
            }
            return NotFound();

        }

        [HttpGet]
        [Route("byPageId/{pageId:guid}")]
        public async Task<IActionResult> GetCanvasElementsByNoteBookId([FromRoute] Guid pageId)
        {
            var canvasElts = await canvasElementRepository.GetCanvasElementsByPageIdAsync(pageId);
            var canvasEltsDto = from ce in canvasElts
                           select new CanvasElementDto()
                           {
                               Id = ce.Id,
                               X = ce.X,
                               Y = ce.Y,
                               HTML = ce.HTML,
                               PageId = ce.PageId
                           };
            return Ok(canvasEltsDto);
        }

        [HttpPost]
        [Route("{pageId:guid}")]
        public async Task<IActionResult> AddCanvasElement([FromRoute] Guid pageId, [FromBody] CanvasElementReqDto ce)
        {
            var canvasElt = await canvasElementRepository.AddCanvasElementAsync(pageId, ce.X, ce.Y, ce.HTML);
            if (canvasElt != null)
            {
                var canvasEltDto = new CanvasElementDto()
                {
                    Id = canvasElt.Id,
                    X = canvasElt.X,
                    Y = canvasElt.Y,
                    HTML = canvasElt.HTML,
                    PageId = canvasElt.PageId
                };
                return Ok(canvasEltDto);
            }
            return NotFound();
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateCanvasElement([FromRoute] Guid id, [FromBody] CanvasElementReqDto ce)
        {
            var canvasElt = await canvasElementRepository.UpdateCanvasElementAsync(id, ce.X, ce.Y, ce.HTML);
            if (canvasElt != null)
            {
                var cavnasEltDto = new CanvasElementDto()
                {
                    Id = canvasElt.Id,
                    X = canvasElt.X,
                    Y = canvasElt.Y,
                    HTML = canvasElt.HTML,
                    PageId = canvasElt.PageId
                };
                return Ok(cavnasEltDto);
            }
            return NotFound();
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteCanvasElement([FromRoute] Guid id)
        {
            var canvasElt = await canvasElementRepository.DeleteCanvasElementAsync(id);
            if (canvasElt != null)
            {
                var canvasEltDto = new CanvasElementDto()
                {
                    Id = canvasElt.Id,
                    X = canvasElt.X,
                    Y = canvasElt.Y,
                    HTML = canvasElt.HTML,
                    PageId = canvasElt.PageId
                };
                return Ok(canvasEltDto);
            }
            return NotFound();
        }
    }
}