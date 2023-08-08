using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class NotahAPIDbContext: DbContext
    {
        public NotahAPIDbContext(DbContextOptions options) : base(options) {

        }

        public DbSet<Account> Accounts { get; set; }

        public DbSet<NoteBook> NoteBooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
                .HasMany(e => e.NoteBooks)
                .WithOne(e => e.Owner)
                .HasForeignKey(e => e.OwnerId)
                .IsRequired();
        }
    }
}