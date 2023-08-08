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
            var noteBooksDto = from nb in noteBooks select new NoteBookDetailsDto() {
                Id = nb.Id,
                Title = nb.Title,
                Notes = nb.Notes,
                OwnerId = nb.OwnerId,
                Owner = new AccountDto() {
                    FullName = nb.Owner.FullName,
                    Email = nb.Owner.Email,
                    Password = nb.Owner.Password
                }
            };
            return Ok(noteBooksDto);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetNoteBook([FromRoute] Guid id) {
            var noteBook = await noteBookRepository.GetNoteBookByIdAsync(id);
            if (noteBook != null) {
                var noteBookDto = new NoteBookDetailsDto() {
                    Id = noteBook.Id,
                    Title = noteBook.Title,
                    Notes = noteBook.Notes,
                    OwnerId = noteBook.OwnerId,
                    Owner = new AccountDto() {
                        FullName = noteBook.Owner.FullName,
                        Email = noteBook.Owner.Email,
                        Password = noteBook.Owner.Password
                    }
                };
                return Ok(noteBookDto);
            }
            return NotFound();
            
        }

        [HttpGet]
        [Route("owner/{ownerId:guid}")]
        public async Task<IActionResult> GetNoteBooksByOwnerId([FromRoute] Guid ownerId) {
            var noteBooks = await noteBookRepository.GetNoteBooksByOwnerIdAsync(ownerId);
            var noteBooksDto = from nb in noteBooks select new NoteBookDetailsDto() {
                Id = nb.Id,
                Title = nb.Title,
                Notes = nb.Notes,
                OwnerId = nb.OwnerId,
                Owner = new AccountDto() {
                    FullName = nb.Owner.FullName,
                    Email = nb.Owner.Email,
                    Password = nb.Owner.Password
                }
            };
            return Ok(noteBooksDto);
        }

        [HttpPost]
        [Route("{ownerId:guid}")]
        public async Task<IActionResult> AddNoteBook([FromRoute] Guid ownerId, NoteBookDto noteBookDto)
        {
            var noteBook = await noteBookRepository.AddNoteBookAsync(ownerId, noteBookDto);
            if (noteBook != null) {
                var noteBookDetailsDto = new NoteBookDetailsDto() {
                    Id = noteBook.Id,
                    Title = noteBook.Title,
                    Notes = noteBook.Notes,
                    OwnerId = noteBook.OwnerId,
                    Owner = new AccountDto() {
                        FullName = noteBook.Owner.FullName,
                        Email = noteBook.Owner.Email,
                        Password = noteBook.Owner.Password
                    }
                };
                return Ok(noteBookDetailsDto);
            }
            return NotFound();
        }
    }
}