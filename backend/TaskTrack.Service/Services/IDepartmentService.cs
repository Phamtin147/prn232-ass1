using System.Collections.Generic;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Services;

public interface IDepartmentService
{
    Task<List<DepartmentDto>> GetAllActiveAsync();
    Task<DepartmentDetailDto?> GetByIdWithProjectsAsync(int id);
    Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto);
    Task<DepartmentDto?> UpdateAsync(int id, UpdateDepartmentDto dto);
    Task<bool> DeleteAsync(int id);
    Task<List<DepartmentDto>> SearchByNameAsync(string name);
}
