using System;
using System.Collections.Generic;
using System.Linq;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _deptRepo;

    public DepartmentService(IDepartmentRepository deptRepo)
    {
        _deptRepo = deptRepo;
    }

    public async Task<List<DepartmentDto>> GetAllActiveAsync()
    {
        var list = await _deptRepo.GetAllActiveAsync();
        return list.Select(d => new DepartmentDto
        {
            DepartmentId = d.DepartmentId,
            DepartmentName = d.DepartmentName,
            DepartmentDescription = d.DepartmentDescription,
            IsActive = d.IsActive
        }).ToList();
    }

    public async Task<DepartmentDetailDto?> GetByIdWithProjectsAsync(int id)
    {
        var dept = await _deptRepo.GetByIdWithProjectsAsync(id);
        if (dept == null) return null;

        return new DepartmentDetailDto
        {
            DepartmentId = dept.DepartmentId,
            DepartmentName = dept.DepartmentName,
            DepartmentDescription = dept.DepartmentDescription,
            IsActive = dept.IsActive,
            Projects = dept.Projects.Select(p => new ProjectDto
            {
                ProjectId = p.ProjectId,
                ProjectName = p.ProjectName,
                Description = p.Description,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status,
                DepartmentId = p.DepartmentId,
                DepartmentName = dept.DepartmentName,
                IsActive = p.IsActive,
                CreatedDate = p.CreatedDate
            }).ToList()
        };
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
    {
        var dept = new Department
        {
            DepartmentName = dto.DepartmentName.Trim(),
            DepartmentDescription = dto.DepartmentDescription.Trim(),
            IsActive = dto.IsActive
        };

        var created = await _deptRepo.CreateAsync(dept);
        return new DepartmentDto
        {
            DepartmentId = created.DepartmentId,
            DepartmentName = created.DepartmentName,
            DepartmentDescription = created.DepartmentDescription,
            IsActive = created.IsActive
        };
    }

    public async Task<DepartmentDto?> UpdateAsync(int id, UpdateDepartmentDto dto)
    {
        var existing = await _deptRepo.GetByIdAsync(id);
        if (existing == null) return null;

        existing.DepartmentName = dto.DepartmentName.Trim();
        existing.DepartmentDescription = dto.DepartmentDescription.Trim();
        existing.IsActive = dto.IsActive;

        await _deptRepo.UpdateAsync(existing);

        return new DepartmentDto
        {
            DepartmentId = existing.DepartmentId,
            DepartmentName = existing.DepartmentName,
            DepartmentDescription = existing.DepartmentDescription,
            IsActive = existing.IsActive
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _deptRepo.GetByIdAsync(id);
        if (existing == null) return false;

        var hasProjects = await _deptRepo.HasProjectsAsync(id);
        if (hasProjects)
        {
            throw new InvalidOperationException("Cannot delete department because it has linked projects.");
        }

        await _deptRepo.DeleteAsync(existing);
        return true;
    }

    public async Task<List<DepartmentDto>> SearchByNameAsync(string name)
    {
        var list = await _deptRepo.SearchByNameAsync(name);
        return list.Select(d => new DepartmentDto
        {
            DepartmentId = d.DepartmentId,
            DepartmentName = d.DepartmentName,
            DepartmentDescription = d.DepartmentDescription,
            IsActive = d.IsActive
        }).ToList();
    }
}
