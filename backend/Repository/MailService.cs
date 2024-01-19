using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Configurations;
using backend.Interfaces;
using backend.Models;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Utils;

namespace backend.Repository
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettingsOptions)
        {
            _mailSettings = mailSettingsOptions.Value;
        }

        public async Task<bool> SendMailAsync(MailData mailData)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_mailSettings.SenderName));
                email.To.Add(MailboxAddress.Parse(mailData.EmailToAddress));
                string htmlTemplate = "";
                string subject = "";
                switch(mailData.EmailPurpose) {
                    case "signup": 
                        htmlTemplate = "Signup.html";
                        subject = "Welcome to Notah!";
                        break;
                }
                email.Subject = subject;

                string filePath = Directory.GetCurrentDirectory() + "/MailTemplates/" + htmlTemplate;
                string templateText = File.ReadAllText(filePath);

                var emailBodyBuilder = new BodyBuilder();

                var image = emailBodyBuilder.LinkedResources.Add(Directory.GetCurrentDirectory() + "/MailTemplates/notah-logo.gif");
                image.ContentId = MimeUtils.GenerateMessageId();

                emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName, image.ContentId);
                emailBodyBuilder.TextBody = subject;
                email.Body = emailBodyBuilder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_mailSettings.UserName, _mailSettings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }
    }
}