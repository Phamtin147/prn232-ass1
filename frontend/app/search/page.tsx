'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Task, Project, Tag } from '@/lib/types';
import { TaskStatusBadge, TaskPriorityBadge, TagBadge } from '@/components/Badges';
import { 
  Search as SearchIcon, 
  Filter, 
  Calendar, 
  FolderKanban, 
  Loader2, 
  RotateCcw,
  CheckSquare
} from 'lucide-react';

export default function SearchPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [tagId, setTagId] = useState<string>('');

  // Load initial dropdown options
  useEffect(() => {
    async function loadOptions() {
      try {
        const [projectsData, tagsData] = await Promise.all([
          api.getProjects().catch(() => []),
          api.getTags().catch(() => []),
        ]);
        setProjects(projectsData);
        setTags(tagsData);
      } catch {
        // ignore
      }
    }
    loadOptions();
  }, []);

  const searchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const filtered = await api.filterTasks({
        title: title || undefined,
        status: status !== '' ? Number(status) : undefined,
        priority: priority !== '' ? Number(priority) : undefined,
        projectId: projectId !== '' ? Number(projectId) : undefined,
        tagId: tagId !== '' ? Number(tagId) : undefined,
      });
      setTasks(filtered);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [title, status, priority, projectId, tagId]);

  // Run search when filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      searchTasks();
    }, 200);
    return () => clearTimeout(handler);
  }, [searchTasks]);

  const handleReset = () => {
    setTitle('');
    setStatus('');
    setPriority('');
    setProjectId('');
    setTagId('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-3">
          <SearchIcon className="w-8 h-8 text-indigo-600" />
          Filter &amp; Search Tasks
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Dynamic multi-criteria search across all tasks, projects, statuses, and tags
        </p>
      </div>

      {/* Filter Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span>Search Filters</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2.5 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
              Task Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Search by title..."
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Status Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="0">To Do</option>
              <option value="1">In Progress</option>
              <option value="2">Done</option>
              <option value="3">Cancelled</option>
            </select>
          </div>

          {/* Priority Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="0">Low</option>
              <option value="1">Medium</option>
              <option value="2">High</option>
              <option value="3">Critical</option>
            </select>
          </div>

          {/* Project Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
              Tag
            </label>
            <select
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t.tagId} value={t.tagId}>
                  #{t.tagName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-600" />
          Search Results ({tasks.length})
        </h2>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" /> Updating results...
          </div>
        )}
      </div>

      {/* Results List */}
      {loading && tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Searching tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-800 space-y-3">
          <SearchIcon className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">No matching tasks found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or clearing filters.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
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

              <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-500 shrink-0">
                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
                  <FolderKanban className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{task.projectName || `Project #${task.projectId}`}</span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Due: {task.dueDate}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
