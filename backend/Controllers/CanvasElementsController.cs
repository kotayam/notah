using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Configurations;
using backend.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.Extensions.Options;
using OpenAI_API.Chat;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CanvasElementsController : Controller
    {
        private readonly ICanvasElementRepository canvasElementRepository;
        private readonly IPageRepository pageRepository;
        private readonly IAccountRepository accountRepository;
        private readonly OpenAIConfig openAIConfig;

        public CanvasElementsController(ICanvasElementRepository canvasElementRepository, IPageRepository pageRepository, IAccountRepository accountRepository, IOptionsMonitor<OpenAIConfig> optionsMonitor)
        {
            this.canvasElementRepository = canvasElementRepository;
            this.pageRepository = pageRepository;
            this.accountRepository = accountRepository;
            this.openAIConfig = optionsMonitor.CurrentValue;
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
            var page = await pageRepository.UpdatePageAsync(pageId, "");
            if (page == null) {
                return BadRequest();
            }
            var exist = await canvasElementRepository.GetCanvasElementByIdAsync(ce.Id);
            if (exist != null) {
                var updatedElt = await canvasElementRepository.UpdateCanvasElementAsync(ce.Id, ce.X, ce.Y, ce.InnerHTML, ce.Width, ce.Height);
                if (updatedElt != null) {
                    var updatedEltAndPageDto = new CanvasElementAndPageDto()
                    {
                        Id = updatedElt.Id,
                        Type = updatedElt.Type,
                        X = updatedElt.X,
                        Y = updatedElt.Y,
                        InnerHTML = updatedElt.InnerHTML,
                        Font = updatedElt.Font,
                        FontSize = updatedElt.FontSize,
                        FontColor = updatedElt.FontColor,
                        Shape = updatedElt.Shape,
                        Width = updatedElt.Width,
                        Height = updatedElt.Height,
                        Row = updatedElt.Row,
                        Column = updatedElt.Column,
                        PageId = updatedElt.PageId,
                        Title = page.Title,
                        DateCreated = page.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                        LastSaved = page.LastSaved.ToString("MM/dd/yyyy h:mm tt")
                    };
                    return Ok(updatedEltAndPageDto);
                }
            }
            else {
                var canvasElt = await canvasElementRepository.AddCanvasElementAsync(pageId, ce.Type, ce.X, ce.Y, ce.InnerHTML, ce.Font, ce.FontSize, ce.FontColor, ce.Shape, ce.Width, ce.Height, ce.Row, ce.Column);
                if (canvasElt != null)
                {
                    var canvasEltAndPageDto = new CanvasElementAndPageDto()
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
                        PageId = canvasElt.PageId,
                        Title = page.Title,
                        DateCreated = page.DateCreated.ToString("MM/dd/yyyy h:mm tt"),
                        LastSaved = page.LastSaved.ToString("MM/dd/yyyy h:mm tt")
                    };
                    return Ok(canvasEltAndPageDto);
                }
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

        [HttpPost]
        [Authorize]
        [Route("generateAnswer/{userId:guid}")]
        public async Task<IActionResult> GenerateAnswer([FromRoute] Guid userId, [FromBody] AIPromptReqDTO req) {
            var account = await accountRepository.GetAccountByIdAsync(userId);
            if (account == null) {
                return NotFound();
            }
            if (account.AIUsageLimit <= 0) {
                return BadRequest();
            }
            var acc = await accountRepository.DecreaseAIUsageAsync(userId);
            if (acc == null) {
                return NotFound();
            }
            var api = new OpenAI_API.OpenAIAPI(openAIConfig.Key);
            var result = await api.Chat.CreateChatCompletionAsync(new OpenAI_API.Chat.ChatRequest() 
                {
                    Model = OpenAI_API.Models.Model.ChatGPTTurbo, 
                    Temperature = 0.1, 
                    MaxTokens = 200,
                    Messages = new ChatMessage[] {
                        new(ChatMessageRole.User, req.Prompt)
                    }
                });
            var resDto = new AIPromptResDto() {
                Answer = result.Choices[0].Message.TextContent,
                AIUsageLimit = acc.AIUsageLimit,
            };
            return Ok(resDto);
        }
    }
}