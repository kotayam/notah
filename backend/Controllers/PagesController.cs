using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PagesController : Controller
    {
        private readonly IPageRepository pageRepository;

        public PagesController(IPageRepository pageRepository)
        {
            this.pageRepository = pageRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPages()
        {
            var pages = await pageRepository.GetAllPagesAsync();
            var pagesDto = from p in pages
                           select new PageDetailsDto()
                           {
                               Id = p.Id,
                               Title = p.Title,
                               DateCreated = p.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                               LastSaved = p.LastSaved.ToString("MM/dd/yyyy h:mm tt"),
                               NoteBookId = p.NoteBookId
                           };
            return Ok(pagesDto);
        }

        [HttpGet]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetPageById([FromRoute] Guid id)
        {
            var page = await pageRepository.GetPageByIdAsync(id);
            if (page != null)
            {
                var pageDto = new PageDetailsDto()
                {
                    Id = page.Id,
                    Title = page.Title,
                    DateCreated = page.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastSaved = page.LastSaved.ToString("MM/dd/yyyy h:mm tt"),
                    NoteBookId = page.NoteBookId
                };
                return Ok(pageDto);
            }
            return NotFound();

        }

        [HttpGet]
        [Authorize]
        [Route("byNoteBookId/{noteBookId:guid}")]
        public async Task<IActionResult> GetpagesByNoteBookId([FromRoute] Guid noteBookId)
        {
            var pages = await pageRepository.GetPagesByNoteBookIdAsync(noteBookId);
            var pagesDto = from p in pages
                           select new PageDetailsDto()
                           {
                               Id = p.Id,
                               Title = p.Title,
                               DateCreated = p.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                               LastSaved = p.LastSaved.ToString("MM/dd/yyyy h:mm tt"),
                               NoteBookId = p.NoteBookId
                           };
            return Ok(pagesDto);
        }

        [HttpPost]
        [Authorize]
        [Route("{noteBookId:guid}")]
        public async Task<IActionResult> AddPage([FromRoute] Guid noteBookId, [FromBody] PageReqDto p)
        {
            var page = await pageRepository.AddPageAsync(noteBookId, p.Title);
            if (page != null)
            {
                var pageDto = new PageDto()
                {
                    Id = page.Id,
                    Title = page.Title,
                    DateCreated = page.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastSaved = page.LastSaved.ToString("MM/dd/yyyy h:mm tt"),
                };
                return Ok(pageDto);
            }
            return NotFound();
        }

        [HttpPut]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdatePage([FromRoute] Guid id, [FromBody] PageReqDto p)
        {
            var page = await pageRepository.UpdatePageAsync(id, p.Title);
            if (page != null)
            {
                var pageDto = new PageDto()
                {
                    Id = page.Id,
                    Title = page.Title,
                    DateCreated = page.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastSaved = page.LastSaved.ToString("MM/dd/yyyy h:mm tt"),
                };
                return Ok(pageDto);
            }
            return NotFound();
        }

        [HttpDelete]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeletePage([FromRoute] Guid id)
        {
            var page = await pageRepository.DeletePageAsync(id);
            if (page != null)
            {
                var pageDto = new PageDto()
                {
                    Id = page.Id,
                    Title = page.Title,
                    DateCreated = page.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastSaved = page.LastSaved.ToString("MM/dd/yyyy h:mm tt"),
                };
                return Ok(pageDto);
            }
            return NotFound();
        }
    }
}