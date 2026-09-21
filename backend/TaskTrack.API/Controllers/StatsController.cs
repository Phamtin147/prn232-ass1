using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TaskTrack.Service.Services;

namespace TaskTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly IDepartmentService _deptService;
    private readonly IProjectService _projectService;
    private readonly ITaskService _taskService;

    public StatsController(
        IDepartmentService deptService,
        IProjectService projectService,
        ITaskService taskService)
    {
        _deptService = deptService;
        _projectService = projectService;
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        var departments = await _deptService.GetAllActiveAsync();
        var projects = await _projectService.GetAllActiveAsync();
        var tasks = await _taskService.GetAllActiveAsync();

        return Ok(new
        {
            departmentsCount = departments.Count,
            projectsCount = projects.Count,
            tasksCount = tasks.Count
        });
    }
}
