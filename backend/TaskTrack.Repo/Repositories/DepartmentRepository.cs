using System;
using System.Collections.Generic;
using System.Linq;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly TaskManagementDbContext _context;

    public DepartmentRepository(TaskManagementDbContext context)
    {
        _context = context;
    }

    public async Task<List<Department>> GetAllActiveAsync()
    {
        return await _context.Departments
            .Where(d => d.IsActive)
            .OrderBy(d => d.DepartmentId)
            .ToListAsync();
    }

    public async Task<Department?> GetByIdAsync(int id)
    {
        return await _context.Departments.FindAsync(id);
    }

    public async Task<Department?> GetByIdWithProjectsAsync(int id)
    {
        return await _context.Departments
            .Include(d => d.Projects.Where(p => p.IsActive))
            .FirstOrDefaultAsync(d => d.DepartmentId == id);
    }

    public async Task<Department> CreateAsync(Department department)
    {
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return department;
    }

    public async Task UpdateAsync(Department department)
    {
        _context.Entry(department).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Department department)
    {
        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> HasProjectsAsync(int departmentId)
    {
        return await _context.Projects.AnyAsync(p => p.DepartmentId == departmentId);
    }

    public async Task<List<Department>> SearchByNameAsync(string name)
    {
        var term = (name ?? string.Empty).Trim().ToLower();
        return await _context.Departments
            .Where(d => d.DepartmentName.ToLower().Contains(term))
            .OrderBy(d => d.DepartmentId)
            .ToListAsync();
    }
}
