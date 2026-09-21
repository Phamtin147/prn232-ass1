using System.Collections.Generic;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface IDepartmentRepository
{
    Task<List<Department>> GetAllActiveAsync();
    Task<Department?> GetByIdAsync(int id);
    Task<Department?> GetByIdWithProjectsAsync(int id);
    Task<Department> CreateAsync(Department department);
    Task UpdateAsync(Department department);
    Task DeleteAsync(Department department);
    Task<bool> HasProjectsAsync(int departmentId);
    Task<List<Department>> SearchByNameAsync(string name);
}
