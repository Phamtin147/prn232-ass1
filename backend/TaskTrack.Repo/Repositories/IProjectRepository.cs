using System.Collections.Generic;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface IProjectRepository
{
    Task<List<Project>> GetAllActiveAsync();
    Task<Project?> GetByIdAsync(int id);
    Task<Project?> GetByIdWithTasksAsync(int id);
    Task<List<Project>> GetByDepartmentAsync(int departmentId);
    Task<Project> CreateAsync(Project project);
    Task UpdateAsync(Project project);
    Task DeleteAsync(Project project);
    Task<bool> HasTasksAsync(int projectId);
    Task<List<Project>> FilterAsync(string? name, short? status, int? departmentId);
}
