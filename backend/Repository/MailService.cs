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

                string templateText = "";
                string subject = "";
                var emailBodyBuilder = new BodyBuilder();
                switch(mailData.EmailPurpose) {
                    case "signup": 
                        subject = "Welcome to Notah!";
                        templateText = @"<!DOCTYPE html>
                        <html>
                        <head>
                        <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
                        <title>Welcome to Notah</title>
                        </head>
                        <body style='font-family: sans-serif; background-color: lightgray;'>
                        <div style='display: grid;grid-column: 1;place-content: center;text-align: center;'>
                        <h1 style='font-weight: 500; font-size: x-large'>Hello {0}!</h1>
                        <div>
                            <img src='https://i.postimg.cc/2SVnhXpG/notah-logo.gif' alt='Notah Logo' style='width: 200px'>
                        </div>
                        <p>Thank you for signing up for Notah! Start taking your notes now!</p>
                        <a
                            href='https://notah.heppoko.space/login'
                            style='text-decoration: underline'
                            >Login to Notah</a
                        >
                        </div>
                        </body>
                        </html>";
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName);
                        break;
                    case "login":
                        subject = "Successful Login to Notah";
                        templateText = @"<!DOCTYPE html>
                        <html>
                        <head>
                            <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
                            <title>Successful Sign-in</title>
                        </head>
                        <body style='font-family: sans-serif; background-color: lightgray;'>
                            <div
                            style='
                                display: grid;
                                grid-column: 1;
                                place-content: center;
                                text-align: center;
                            '
                            >
                            <h1 style='font-weight: 500; font-size: x-large'>Welcome back {0}!</h1>
                            <div>
                                <img src='https://i.postimg.cc/2SVnhXpG/notah-logo.gif' alt='Notah Logo' style='width: 200px'>
                            </div>
                            <p>Successfully logged in at {1}.</p>
                            <a
                                href='https://notah.heppoko.space'
                                style='text-decoration: underline'
                                >Notah Home Page</a
                            >
                            </div>
                        </body>
                        </html>";
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName, DateTime.UtcNow.ToString("ddd, dd MMM yyy HH:mm:ss 'GMT'"));
                        break;
                    case "account-delete":
                        subject = "Successfully Deleted Your Account";
                        templateText = @"<!DOCTYPE html>
                        <html>
                        <head>
                            <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
                            <title>Successfully Deleted Account</title>
                        </head>
                        <body style='font-family: sans-serif; background-color: lightgray;'>
                            <div
                            style='
                                display: grid;
                                grid-column: 1;
                                place-content: center;
                                text-align: center;
                            '
                            >
                            <h1 style='font-weight: 500; font-size: x-large'>{0}, thank you for using Notah!</h1>
                            <div>
                                <img src='https://i.postimg.cc/2SVnhXpG/notah-logo.gif' alt='Notah Logo' style='width: 200px'>
                            </div>
                            <p>Your account has been deleted. Thank you for using Notah!</p>
                            <a
                                href='https://notah.heppoko.space'
                                style='text-decoration: underline'
                                >Notah Home Page</a
                            >
                            </div>
                        </body>
                        </html>";
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName);
                        break;
                    case "account-update":
                        subject = "Successfully Updated Your Account";
                        templateText = @"<!DOCTYPE html>
                        <html>
                        <head>
                            <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
                            <title>Successfully Updated Account</title>
                        </head>
                        <body style='font-family: sans-serif; background-color: lightgray;'>
                            <div
                            style='
                                display: grid;
                                grid-column: 1;
                                place-content: center;
                                text-align: center;
                            '
                            >
                            <h1 style='font-weight: 500; font-size: x-large'>{0}, your account information has been updated.</h1>
                            <div>
                                <img src='https://i.postimg.cc/2SVnhXpG/notah-logo.gif' alt='Notah Logo' style='width: 200px'>
                            </div>
                            <p>Your username or email has been updated at {1}</p>
                            <a
                                href='https://notah.heppoko.space/login'
                                style='text-decoration: underline'
                                >Login to Notah</a
                            >
                            </div>
                        </body>
                        </html>";
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName, DateTime.UtcNow.ToString("ddd, dd MMM yyy HH:mm:ss 'GMT'"));
                        break;
                    case "password-change":
                        subject = "Successfully Changed Your Password";
                        templateText = @"<!DOCTYPE html>
                        <html>
                        <head>
                            <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
                            <title>Successfully Changed Your Password</title>
                        </head>
                        <body style='font-family: sans-serif; background-color: lightgray;'>
                            <div
                            style='
                                display: grid;
                                grid-column: 1;
                                place-content: center;
                                text-align: center;
                            '
                            >
                            <h1 style='font-weight: 500; font-size: x-large'>{0}, your password has been changed.</h1>
                            <div>
                                <img src='https://i.postimg.cc/2SVnhXpG/notah-logo.gif' alt='Notah Logo' style='width: 200px'>
                            </div>
                            <p>Your account password has been updated at {1}</p>
                            <a
                                href='https://notah.heppoko.space/login'
                                style='text-decoration: underline'
                                >Login to Notah</a
                            >
                            </div>
                        </body>
                        </html>";
                        emailBodyBuilder.HtmlBody = string.Format(templateText, mailData.EmailToName, DateTime.UtcNow.ToString("ddd, dd MMM yyy HH:mm:ss 'GMT'"));
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