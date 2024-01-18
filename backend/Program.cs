using System.Text;
using System.Text.Json.Serialization;
using backend.Authentication;
using backend.Configurations;
using backend.Data;
using backend.Interfaces;
using backend.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var AllowedOrigins = "allowedOrigins";

var builder = WebApplication.CreateBuilder(args);
var JWTConfig = builder.Configuration.GetSection("Jwt");
var issuer = JWTConfig.GetValue<string>("Issuer") ?? "";
var audience = JWTConfig.GetValue<string>("Audience") ?? "";
var key = JWTConfig.GetValue<string>("Key") ?? "";

// Add services to the container.
builder.Services.Configure<OpenAIConfig>(builder.Configuration.GetSection("OpenAI"));
builder.Services.Configure<JWTConfig>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
);
builder.Services.AddDbContext<NotahAPIDbContext>(options => options.UseInMemoryDatabase("NotahDb"));
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<INoteBookRepository, NoteBookRepository>();
builder.Services.AddScoped<IPageRepository, PageRepository>();
builder.Services.AddScoped<ICanvasElementRepository, CanvasElementRepository>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddCors(options => {
    options.AddPolicy(name: AllowedOrigins, 
    policy => {
        policy.WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddCookie(options => {
        options.Cookie.Name = "accessToken";
    })
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["accessToken"];
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(AllowedOrigins);

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
