using System.Collections.Generic;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using TaskItem = TaskTrack.Repo.Models.Task;

namespace TaskTrack.Repo.Repositories;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetAllActiveAsync();
    Task<TaskItem?> GetByIdWithTagsAsync(int id);
    Task<List<TaskItem>> GetByProjectAsync(int projectId);
    Task<TaskItem> CreateAsync(TaskItem task, IEnumerable<int>? tagIds);
    Task UpdateAsync(TaskItem task, IEnumerable<int>? tagIds);
    Task<bool> SoftDeleteAsync(int id);
    Task<List<TaskItem>> FilterAsync(string? title, short? status, short? priority, int? projectId, int? tagId);
}
