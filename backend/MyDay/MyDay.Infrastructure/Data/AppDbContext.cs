using Microsoft.EntityFrameworkCore;
using MyDay.Domain.Entities;

namespace MyDay.Infrastructure.Data;

// AppDbContext = the bridge between C# and the database
// Entity Framework uses this class to:
// 1. Create the database tables
// 2. Read and write data
public class AppDbContext : DbContext
{
    // Constructor - receives database settings from Program.cs
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Each DbSet = one table in the database
    public DbSet<User> Users { get; set; }
    public DbSet<Todo> Todos { get; set; }
    public DbSet<Habit> Habits { get; set; }
    public DbSet<HabitLog> HabitLogs { get; set; }
    public DbSet<Goal> Goals { get; set; }
    public DbSet<GoalStep> GoalSteps { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User email must be unique - no two users with same email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // One User has many Todos
        // If user is deleted → delete all their todos too
        modelBuilder.Entity<Todo>()
            .HasOne(t => t.User)
            .WithMany(u => u.Todos)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // One User has many Habits
        modelBuilder.Entity<Habit>()
            .HasOne(h => h.User)
            .WithMany(u => u.Habits)
            .HasForeignKey(h => h.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // One Habit has many HabitLogs
        modelBuilder.Entity<HabitLog>()
            .HasOne(hl => hl.Habit)
            .WithMany(h => h.Logs)
            .HasForeignKey(hl => hl.HabitId)
            .OnDelete(DeleteBehavior.Cascade);

        // One User has many Goals
        modelBuilder.Entity<Goal>()
            .HasOne(g => g.User)
            .WithMany(u => u.Goals)
            .HasForeignKey(g => g.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // One Goal has many GoalSteps
        modelBuilder.Entity<GoalStep>()
            .HasOne(gs => gs.Goal)
            .WithMany(g => g.Steps)
            .HasForeignKey(gs => gs.GoalId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}