using System.Collections.Generic;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Services;

public interface ITagService
{
    Task<List<TagDto>> GetAllAsync();
    Task<TagDto?> GetByIdAsync(int id);
    Task<TagDto> CreateAsync(CreateTagDto dto);
    Task<TagDto?> UpdateAsync(int id, UpdateTagDto dto);
    Task<bool> DeleteAsync(int id);
}
