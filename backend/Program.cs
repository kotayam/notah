using System.Text.Json.Serialization;
using backend.Data;
using backend.Interfaces;
using backend.Repository;
using Microsoft.EntityFrameworkCore;

var AllowedOrigins = "allowedOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<NotahAPIDbContext>(options => options.UseInMemoryDatabase("NotahDb"));
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<INoteBookRepository, NoteBookRepository>();
builder.Services.AddScoped<IPageRepository, PageRepository>();
builder.Services.AddScoped<ICanvasElementRepository, CanvasElementRepository>();
builder.Services.AddCors(options => {
    options.AddPolicy(name: AllowedOrigins, 
    policy => {
        policy.WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
builder.Services.AddAuthentication();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(AllowedOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
