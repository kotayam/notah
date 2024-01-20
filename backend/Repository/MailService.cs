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
                
                string filePath = "";
                string templateText = "";
                string subject = "";
                var emailBodyBuilder = new BodyBuilder();
                var image = emailBodyBuilder.LinkedResources.Add(Directory.GetCurrentDirectory() + "/MailTemplates/notah-logo.gif");
                image.ContentId = MimeUtils.GenerateMessageId();
                switch(mailData.EmailPurpose) {
                    case "signup": 
                        subject = "Welcome to Notah!";
                        filePath = Directory.GetCurrentDirectory() + "/MailTemplates/Signup.html";
                        templateText = File.ReadAllText(filePath);
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName, image.ContentId);
                        break;
                    case "login":
                        subject = "Successful Login to Notah";
                        filePath = Directory.GetCurrentDirectory() + "/MailTemplates/Login.html";
                        templateText = File.ReadAllText(filePath);
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName, image.ContentId, DateTime.Now);
                        break;
                    case "account-delete":
                        subject = "Successfully Deleted Your Account";
                        filePath = Directory.GetCurrentDirectory() + "/MailTemplates/Delete.html";
                        templateText = File.ReadAllText(filePath);
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName, image.ContentId);
                        break;
                    case "account-update":
                        subject = "Successfully Updated Your Account";
                        filePath = Directory.GetCurrentDirectory() + "/MailTemplates/Update.html";
                        templateText = File.ReadAllText(filePath);
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName, image.ContentId, DateTime.Now);
                        break;
                    case "password-change":
                        subject = "Successfully Changed Your Password";
                        filePath = Directory.GetCurrentDirectory() + "/MailTemplates/Password.html";
                        templateText = File.ReadAllText(filePath);
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName, image.ContentId, DateTime.Now);
                        break;
                }
                email.Subject = subject;
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