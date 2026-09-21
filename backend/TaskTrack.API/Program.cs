using System;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Npgsql;
using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.Services;

var builder = WebApplication.CreateBuilder(args);

// Helper to parse DATABASE_URL (Render PostgreSQL url) if provided
string ResolveConnectionString(IConfiguration config)
{
    var envDatabaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (!string.IsNullOrWhiteSpace(envDatabaseUrl))
    {
        if (envDatabaseUrl.StartsWith("postgres://") || envDatabaseUrl.StartsWith("postgresql://"))
        {
            var uri = new Uri(envDatabaseUrl);
            var userInfo = uri.UserInfo.Split(':');
            var builder = new NpgsqlConnectionStringBuilder
            {
                Host = uri.Host,
                Port = uri.Port > 0 ? uri.Port : 5432,
                Username = userInfo.Length > 0 ? userInfo[0] : "",
                Password = userInfo.Length > 1 ? userInfo[1] : "",
                Database = uri.AbsolutePath.TrimStart('/'),
                SslMode = SslMode.Prefer,
            };
            return builder.ToString();
        }
        return envDatabaseUrl;
    }

    return config.GetConnectionString("DefaultConnection") 
        ?? "Host=localhost;Port=5432;Database=TaskManagementDB;Username=postgres;Password=postgres";
}

var connectionString = ResolveConnectionString(builder.Configuration);

// Add services
builder.Services.AddDbContext<TaskManagementDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register Repositories
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();

// Register Services
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ITagService, TagService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TaskTrack API",
        Version = "v1",
        Description = "PRN232 Assignment 1 - Task & Team Management RESTful API"
    });
});

var app = builder.Build();

// Enable Swagger in Development AND Production so grader can access Swagger on Render
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskTrack API v1");
    c.RoutePrefix = string.Empty; // Serve Swagger UI at root URL
});

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
