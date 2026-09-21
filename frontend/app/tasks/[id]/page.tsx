'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Task } from '@/lib/types';
import { TaskStatusBadge, TaskPriorityBadge, TagBadge } from '@/components/Badges';
import { 
  CheckSquare, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FolderKanban, 
  Tag as TagIcon, 
  Loader2, 
  AlertCircle,
  FileEdit
} from 'lucide-react';

export default function TaskDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getTaskById(id);
        setTask(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load task details');
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
        <p className="text-sm text-slate-500">Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="text-sm">{error || 'Task not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={task.projectId ? `/projects/${task.projectId}` : '/'}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Project
        </Link>
        <Link
          href="/tasks/manage"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
        >
          <FileEdit className="w-4 h-4" />
          Manage in CRUD Table
        </Link>
      </div>

      {/* Task Full Information Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
              Task ID #{task.taskId}
            </span>
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Status:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {task.isActive ? 'Active' : 'Archived'}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-100">
          {task.title}
        </h1>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Description
          </h3>
          <p className="text-base text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-zinc-950 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800/80">
            {task.description || 'No description provided.'}
          </p>
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5" /> Associated Tags
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {task.tags && task.tags.length > 0 ? (
              task.tags.map((tg) => <TagBadge key={tg.tagId} tag={tg} />)
            ) : (
              <span className="text-sm text-slate-400">No tags assigned.</span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-zinc-800 text-sm">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-500" /> Parent Project
            </span>
            <Link
              href={`/projects/${task.projectId}`}
              className="font-bold text-slate-900 dark:text-zinc-100 hover:text-indigo-600 underline decoration-indigo-300 block"
            >
              {task.projectName || `Project #${task.projectId}`}
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Due Date
            </span>
            <p className="font-bold text-slate-900 dark:text-zinc-100">
              {task.dueDate || 'No due date set'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> Created At
            </span>
            <p className="font-semibold text-slate-700 dark:text-zinc-300">
              {new Date(task.createdDate).toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> Last Modified
            </span>
            <p className="font-semibold text-slate-700 dark:text-zinc-300">
              {task.modifiedDate ? new Date(task.modifiedDate).toLocaleString() : 'Not modified yet'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
