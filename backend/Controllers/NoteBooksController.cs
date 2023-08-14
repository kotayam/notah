using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTO;
using backend.Interfaces;
using backend.Models;
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

        public NoteBooksController(INoteBookRepository noteBookRepository)
        {
            this.noteBookRepository = noteBookRepository;
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
                    Pages = (from n in noteBook.Pages
                             select new PageDto()
                             {
                                 Id = n.Id,
                                 Title = n.Title
                             }).ToList(),
                    OwnerId = noteBook.OwnerId
                };
                return Ok(noteBookDto);
            }
            return NotFound();

        }

        [HttpGet]
        [Route("byOwnerId/{ownerId:guid}")]
        public async Task<IActionResult> GetNoteBooksByOwnerId([FromRoute] Guid ownerId)
        {
            var noteBooks = await noteBookRepository.GetNoteBooksByOwnerIdAsync(ownerId);
            var noteBooksDto = from nb in noteBooks
                               select new NoteBookDetailsDto()
                               {
                                   Id = nb.Id,
                                   Title = nb.Title,
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
        [Route("{ownerId:guid}")]
        public async Task<IActionResult> AddNoteBook([FromRoute] Guid ownerId, [FromBody] NoteBookReqDto nb)
        {
            var noteBook = await noteBookRepository.AddNoteBookAsync(ownerId, nb.Title);
            if (noteBook != null)
            {
                var noteBookDto = new NoteBookDto()
                {
                    Id = noteBook.Id,
                    Title = noteBook.Title
                };
                return Ok(noteBookDto);
            }
            return NotFound();
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateNoteBook([FromRoute] Guid id, [FromBody] NoteBookReqDto nb)
        {
            var noteBook = await noteBookRepository.UpdateNoteBookAsync(id, nb.Title);
            if (noteBook != null)
            {
                var noteBookDto = new NoteBookDto()
                {
                    Id = noteBook.Id,
                    Title = noteBook.Title
                };
                return Ok(noteBookDto);
            }
            return NotFound();
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteNoteBook([FromRoute] Guid id)
        {
            var noteBook = await noteBookRepository.DeleteNoteBookAsync(id);
            if (noteBook != null)
            {
                var noteBookDto = new NoteBookDto()
                {
                    Id = noteBook.Id,
                    Title = noteBook.Title
                };
                return Ok(noteBookDto);
            }
            return NotFound();
        }
    }
}