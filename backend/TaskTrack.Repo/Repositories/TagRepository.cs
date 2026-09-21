using System.Collections.Generic;
using System.Linq;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public class TagRepository : ITagRepository
{
    private readonly TaskManagementDbContext _context;

    public TagRepository(TaskManagementDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tag>> GetAllAsync()
    {
        return await _context.Tags.OrderBy(t => t.TagName).ToListAsync();
    }

    public async Task<Tag?> GetByIdAsync(int id)
    {
        return await _context.Tags.FindAsync(id);
    }

    public async Task<List<Tag>> GetByIdsAsync(IEnumerable<int> ids)
    {
        return await _context.Tags.Where(t => ids.Contains(t.TagId)).ToListAsync();
    }

    public async Task<Tag> CreateAsync(Tag tag)
    {
        _context.Tags.Add(tag);
        await _context.SaveChangesAsync();
        return tag;
    }

    public async Task UpdateAsync(Tag tag)
    {
        _context.Entry(tag).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Tag tag)
    {
        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsUsedByAnyTaskAsync(int tagId)
    {
        return await _context.Tasks.AnyAsync(t => t.Tags.Any(tg => tg.TagId == tagId));
    }
}
