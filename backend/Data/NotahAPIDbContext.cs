using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class NotahAPIDbContext : DbContext
    {
        protected readonly IConfiguration configuration;
        public NotahAPIDbContext(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(configuration.GetConnectionString("ProductionAws"));
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<NoteBook> NoteBooks { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<CanvasElement> CanvasElements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
                .HasMany(e => e.NoteBooks)
                .WithOne(e => e.Owner)
                .HasForeignKey(e => e.OwnerId)
                .IsRequired();
            modelBuilder.Entity<NoteBook>()
                .HasMany(e => e.Pages)
                .WithOne(e => e.NoteBook)
                .HasForeignKey(e => e.NoteBookId)
                .IsRequired();
            modelBuilder.Entity<Page>()
                .HasMany(e => e.CanvasElements)
                .WithOne(e => e.Page)
                .HasForeignKey(e => e.PageId)
                .IsRequired();
            modelBuilder.Entity<CanvasElement>()
                .HasOne(e => e.Page)
                .WithMany(e => e.CanvasElements)
                .HasForeignKey(e => e.PageId)
                .IsRequired();
        }
    }
}