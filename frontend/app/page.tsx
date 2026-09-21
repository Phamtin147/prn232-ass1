'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Project, Stats } from '@/lib/types';
import { ProjectStatusBadge } from '@/components/Badges';
import { 
  Building2, 
  FolderKanban, 
  CheckSquare, 
  ArrowRight, 
  Calendar, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, projectsData] = await Promise.all([
          api.getStats(),
          api.getProjects(),
        ]);
        setStats(statsData);
        setProjects(projectsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 flex items-center gap-4">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <div>
          <h3 className="font-semibold text-base">Error loading data</h3>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-8 sm:p-12 shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-100 text-xs font-semibold backdrop-blur-xs">
            PRN232 Practical Exam 1
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Task &amp; Team Management
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg leading-relaxed">
            Welcome to the centralized task tracking portal. Browse departments, view ongoing projects, and track live tasks across the entire organization.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-sm"
            >
              Browse Departments
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/30 text-white border border-white/20 font-semibold text-sm hover:bg-indigo-500/40 transition-colors"
            >
              Search Tasks
            </Link>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Active Departments</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-zinc-100 mt-1">
              {stats?.departmentsCount ?? 0}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <FolderKanban className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Active Projects</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-zinc-100 mt-1">
              {stats?.projectsCount ?? 0}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <CheckSquare className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Active Tasks</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-zinc-100 mt-1">
              {stats?.tasksCount ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Active Projects Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Active Projects</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Overview of all active organizational initiatives
            </p>
          </div>
          <Link
            href="/search"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
          >
            Explore all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.projectId}
              href={`/projects/${project.projectId}`}
              className="group block p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                  {project.departmentName || 'General'}
                </span>
                <ProjectStatusBadge status={project.status} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {project.projectName}
              </h3>

              <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 line-clamp-2 min-h-10">
                {project.description || 'No description provided.'}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.startDate}</span>
                </div>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
                  View Tasks &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
