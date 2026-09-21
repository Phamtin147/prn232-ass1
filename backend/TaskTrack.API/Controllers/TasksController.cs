using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Services;

namespace TaskTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tasks = await _taskService.GetAllActiveAsync();
        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _taskService.GetByIdWithTagsAsync(id);
        if (task == null)
        {
            return NotFound(new { message = $"Task with ID {id} not found." });
        }
        return Ok(task);
    }

    [HttpGet("project/{projectId:int}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var tasks = await _taskService.GetByProjectAsync(projectId);
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _taskService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.TaskId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _taskService.UpdateAsync(id, dto);
            if (updated == null)
            {
                return NotFound(new { message = $"Task with ID {id} not found." });
            }
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var success = await _taskService.SoftDeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Task with ID {id} not found." });
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string? title,
        [FromQuery] short? status,
        [FromQuery] short? priority,
        [FromQuery] int? projectId,
        [FromQuery] int? tagId)
    {
        var results = await _taskService.FilterAsync(title, status, priority, projectId, tagId);
        return Ok(results);
    }
}
