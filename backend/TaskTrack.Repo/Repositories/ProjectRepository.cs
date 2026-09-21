using System;
using System.Collections.Generic;
using System.Linq;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly TaskManagementDbContext _context;

    public ProjectRepository(TaskManagementDbContext context)
    {
        _context = context;
    }

    public async Task<List<Project>> GetAllActiveAsync()
    {
        return await _context.Projects
            .Include(p => p.Department)
            .Where(p => p.IsActive)
            .OrderBy(p => p.ProjectId)
            .ToListAsync();
    }

    public async Task<Project?> GetByIdAsync(int id)
    {
        return await _context.Projects
            .Include(p => p.Department)
            .FirstOrDefaultAsync(p => p.ProjectId == id);
    }

    public async Task<Project?> GetByIdWithTasksAsync(int id)
    {
        return await _context.Projects
            .Include(p => p.Department)
            .Include(p => p.Tasks.Where(t => t.IsActive))
                .ThenInclude(t => t.Tags)
            .FirstOrDefaultAsync(p => p.ProjectId == id);
    }

    public async Task<List<Project>> GetByDepartmentAsync(int departmentId)
    {
        return await _context.Projects
            .Include(p => p.Department)
            .Where(p => p.DepartmentId == departmentId && p.IsActive)
            .OrderBy(p => p.ProjectId)
            .ToListAsync();
    }

    public async Task<Project> CreateAsync(Project project)
    {
        project.CreatedDate = DateTime.UtcNow;
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        await _context.Entry(project).Reference(p => p.Department).LoadAsync();
        return project;
    }

    public async Task UpdateAsync(Project project)
    {
        _context.Entry(project).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Project project)
    {
        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> HasTasksAsync(int projectId)
    {
        return await _context.Tasks.AnyAsync(t => t.ProjectId == projectId);
    }

    public async Task<List<Project>> FilterAsync(string? name, short? status, int? departmentId)
    {
        var query = _context.Projects
            .Include(p => p.Department)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
        {
            var term = name.Trim().ToLower();
            query = query.Where(p => p.ProjectName.ToLower().Contains(term));
        }

        if (status.HasValue)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        if (departmentId.HasValue && departmentId.Value > 0)
        {
            query = query.Where(p => p.DepartmentId == departmentId.Value);
        }

        return await query.OrderBy(p => p.ProjectId).ToListAsync();
    }
}
