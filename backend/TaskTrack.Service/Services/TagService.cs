using System;
using System.Collections.Generic;
using System.Linq;
using Task = System.Threading.Tasks.Task;
using System.Threading.Tasks;
using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Services;

public class TagService : ITagService
{
    private readonly ITagRepository _tagRepo;

    public TagService(ITagRepository tagRepo)
    {
        _tagRepo = tagRepo;
    }

    public async Task<List<TagDto>> GetAllAsync()
    {
        var tags = await _tagRepo.GetAllAsync();
        return tags.Select(t => new TagDto
        {
            TagId = t.TagId,
            TagName = t.TagName,
            Color = t.Color
        }).ToList();
    }

    public async Task<TagDto?> GetByIdAsync(int id)
    {
        var t = await _tagRepo.GetByIdAsync(id);
        if (t == null) return null;

        return new TagDto
        {
            TagId = t.TagId,
            TagName = t.TagName,
            Color = t.Color
        };
    }

    public async Task<TagDto> CreateAsync(CreateTagDto dto)
    {
        var tag = new Tag
        {
            TagName = dto.TagName.Trim(),
            Color = dto.Color?.Trim().ToUpperInvariant()
        };

        var created = await _tagRepo.CreateAsync(tag);
        return new TagDto
        {
            TagId = created.TagId,
            TagName = created.TagName,
            Color = created.Color
        };
    }

    public async Task<TagDto?> UpdateAsync(int id, UpdateTagDto dto)
    {
        var tag = await _tagRepo.GetByIdAsync(id);
        if (tag == null) return null;

        tag.TagName = dto.TagName.Trim();
        tag.Color = dto.Color?.Trim().ToUpperInvariant();

        await _tagRepo.UpdateAsync(tag);
        return new TagDto
        {
            TagId = tag.TagId,
            TagName = tag.TagName,
            Color = tag.Color
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var tag = await _tagRepo.GetByIdAsync(id);
        if (tag == null) return false;

        var isUsed = await _tagRepo.IsUsedByAnyTaskAsync(id);
        if (isUsed)
        {
            throw new InvalidOperationException("Cannot delete tag because it is used by one or more tasks.");
        }

        await _tagRepo.DeleteAsync(tag);
        return true;
    }
}
