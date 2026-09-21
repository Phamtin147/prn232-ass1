'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ProjectDetail } from '@/lib/types';
import { ProjectStatusBadge, TaskStatusBadge, TaskPriorityBadge, TagBadge } from '@/components/Badges';
import { 
  FolderKanban, 
  CheckSquare, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Building2, 
  Loader2, 
  AlertCircle,
  Plus
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getProjectById(id);
        setProject(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="text-sm">{error || 'Project not found.'}</p>
        </div>
      </div>
    );
  }

  const filteredTasks = (project.tasks || []).filter((task) => {
    if (statusFilter === 'all') return true;
    return task.status === Number(statusFilter);
  });

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>
      </div>

      {/* Project Header Info */}
      <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <FolderKanban className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Project #{project.projectId}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-100">
                {project.projectName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>

        <p className="text-slate-600 dark:text-zinc-400 text-base leading-relaxed">
          {project.description || 'No detailed description available.'}
        </p>

        {/* Metadata Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span>Department:</span>
            <Link
              href={`/departments/${project.departmentId}`}
              className="font-semibold text-slate-900 dark:text-zinc-100 hover:text-indigo-600 underline decoration-indigo-300"
            >
              {project.departmentName || `Dept #${project.departmentId}`}
            </Link>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Start Date:</span>
            <span className="font-semibold text-slate-900 dark:text-zinc-100">{project.startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>End Date:</span>
            <span className="font-semibold text-slate-900 dark:text-zinc-100">{project.endDate || 'Ongoing'}</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              Project Tasks ({filteredTasks.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Click any task to view full details
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Status Filter tabs (Bonus Feature) */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-300">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'all' ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs' : ''
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('0')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === '0' ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs' : ''
                }`}
              >
                To Do
              </button>
              <button
                onClick={() => setStatusFilter('1')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === '1' ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs' : ''
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setStatusFilter('2')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === '2' ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs' : ''
                }`}
              >
                Done
              </button>
            </div>

            <Link
              href="/tasks/manage"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </Link>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-800 text-slate-500">
            No tasks match the selected status filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <Link
                key={task.taskId}
                href={`/tasks/${task.taskId}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">#{task.taskId}</span>
                    <TaskStatusBadge status={task.status} />
                    <TaskPriorityBadge priority={task.priority} />
                    {task.tags?.map((tg) => (
                      <TagBadge key={tg.tagId} tag={tg} />
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: <strong className="text-slate-700 dark:text-zinc-300">{task.dueDate}</strong></span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
