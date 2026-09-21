using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Services;

namespace TaskTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var projects = await _projectService.GetAllActiveAsync();
        return Ok(projects);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await _projectService.GetByIdWithTasksAsync(id);
        if (project == null)
        {
            return NotFound(new { message = $"Project with ID {id} not found." });
        }
        return Ok(project);
    }

    [HttpGet("department/{departmentId:int}")]
    public async Task<IActionResult> GetByDepartment(int departmentId)
    {
        var projects = await _projectService.GetByDepartmentAsync(departmentId);
        return Ok(projects);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _projectService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.ProjectId }, created);
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
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProjectDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _projectService.UpdateAsync(id, dto);
            if (updated == null)
            {
                return NotFound(new { message = $"Project with ID {id} not found." });
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
            var success = await _projectService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Project with ID {id} not found." });
            }
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? name, [FromQuery] short? status, [FromQuery] int? departmentId)
    {
        var results = await _projectService.FilterAsync(name, status, departmentId);
        return Ok(results);
    }
}
