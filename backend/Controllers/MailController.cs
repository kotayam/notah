using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class MailController : ControllerBase
    {
        private readonly IMailService mailService;

        public MailController(IMailService mailService) {
            this.mailService = mailService;
        }

        [HttpPost]
        [Route("SendMail")]
        public async Task<IActionResult> SendMail([FromBody] MailData mailData) {
            var success = await mailService.SendMailAsync(mailData);
            if (!success) {
                return BadRequest();
            }
            return Ok();
        }
    }
}