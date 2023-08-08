using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
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
        public NotahAPIDbContext dbContext;

        public NoteBooksController(NotahAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNotebooks()
        {
            return Ok(await dbContext.NoteBooks.ToListAsync());
        }

        [HttpPost]
        [Route("{ownerId:guid}")]
        public async Task<IActionResult> AddNoteBook([FromRoute] Guid ownerId, AddNoteBookRequest addNoteBookRequest)
        {
            var owner = await dbContext.Accounts.FindAsync(ownerId);
            if (owner != null)
            {
                var notebook = new NoteBook()
                {
                    Id = Guid.NewGuid(),
                    Title = addNoteBookRequest.Title,
                    OwnerId = ownerId
                };

                await dbContext.NoteBooks.AddAsync(notebook);
                await dbContext.SaveChangesAsync();

                return Ok(notebook);
            }
            return NotFound();
        }
    }
}