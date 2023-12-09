using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTO;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class NoteBooksController : Controller
    {
        public INoteBookRepository noteBookRepository;
        public IPageRepository pageRepository;

        public NoteBooksController(INoteBookRepository noteBookRepository, IPageRepository pageRepository)
        {
            this.noteBookRepository = noteBookRepository;
            this.pageRepository = pageRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNoteBooks()
        {
            var noteBooks = await noteBookRepository.GetAllNoteBooksAsync();
            var noteBooksDto = from nb in noteBooks
                               select new NoteBookDetailsDto()
                               {
                                   Id = nb.Id,
                                   Title = nb.Title,
                                   DateCreated = nb.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                                   LastEdited = nb.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                                   Pages = (from n in nb.Pages
                                            select new PageDto()
                                            {
                                                Id = n.Id,
                                                Title = n.Title
                                            }).ToList(),
                                   OwnerId = nb.OwnerId,
                               };
            return Ok(noteBooksDto);
        }

        [HttpGet]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetNoteBookById([FromRoute] Guid id)
        {
            var noteBook = await noteBookRepository.GetNoteBookByIdAsync(id);
            if (noteBook != null)
            {
                var noteBookDto = new NoteBookDetailsDto()
                {
                    Id = noteBook.Id,
                    Title = noteBook.Title,
                    DateCreated = noteBook.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastEdited = noteBook.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                    Pages = (from n in noteBook.Pages
                             select new PageDto()
                             {
                                 Id = n.Id,
                                 Title = n.Title,
                             }).ToList(),
                    OwnerId = noteBook.OwnerId
                };
                return Ok(noteBookDto);
            }
            return NotFound();

        }

        [HttpGet]
        [Authorize]
        [Route("byOwnerId/{ownerId:guid}")]
        public async Task<IActionResult> GetNoteBooksByOwnerId([FromRoute] Guid ownerId)
        {
            var noteBooks = await noteBookRepository.GetNoteBooksByOwnerIdAsync(ownerId);
            var noteBooksDto = from nb in noteBooks
                               select new NoteBookDetailsDto()
                               {
                                   Id = nb.Id,
                                   Title = nb.Title,
                                   DateCreated = nb.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                                   LastEdited = nb.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                                   Pages = (from n in nb.Pages
                                            select new PageDto()
                                            {
                                                Id = n.Id,
                                                Title = n.Title
                                            }).ToList(),
                                   OwnerId = nb.OwnerId
                               };
            return Ok(noteBooksDto);
        }

        [HttpPost]
        [Authorize]
        [Route("{ownerId:guid}")]
        public async Task<IActionResult> AddNoteBook([FromRoute] Guid ownerId, [FromBody] NoteBookReqDto nb)
        {
            var noteBook = await noteBookRepository.AddNoteBookAsync(ownerId, nb.Title);
            if (noteBook != null)
            {
                var page = await pageRepository.AddPageAsync(noteBook.Id, "Untitled");
                if (page != null) {
                    var noteBookDto = new NoteBookDto()
                    {
                    Id = noteBook.Id,
                    Title = noteBook.Title,
                    DateCreated = noteBook.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastEdited = noteBook.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                    };
                    return Ok(noteBookDto);
                }
            }
            return NotFound();
        }

        [HttpPut]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateNoteBook([FromRoute] Guid id, [FromBody] NoteBookReqDto nb)
        {
            var noteBook = await noteBookRepository.UpdateNoteBookAsync(id, nb.Title);
            if (noteBook != null)
            {
                var noteBookDto = new NoteBookDto()
                {
                    Id = noteBook.Id,
                    Title = noteBook.Title,
                    DateCreated = noteBook.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastEdited = noteBook.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                };
                return Ok(noteBookDto);
            }
            return NotFound();
        }

        [HttpDelete]
        [Authorize]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteNoteBook([FromRoute] Guid id)
        {
            var noteBook = await noteBookRepository.DeleteNoteBookAsync(id);
            if (noteBook != null)
            {
                var noteBookDto = new NoteBookDto()
                {
                    Id = noteBook.Id,
                    Title = noteBook.Title,
                    DateCreated = noteBook.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                    LastEdited = noteBook.LastEdited.ToString("MM/dd/yyyy h:mm tt"),
                };
                return Ok(noteBookDto);
            }
            return NotFound();
        }
    }
}