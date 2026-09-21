'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { DepartmentDetail } from '@/lib/types';
import { ProjectStatusBadge } from '@/components/Badges';
import { Building2, FolderKanban, ArrowLeft, ArrowRight, Calendar, Loader2, AlertCircle } from 'lucide-react';

export default function DepartmentDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [department, setDepartment] = useState<DepartmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getDepartmentById(id);
        setDepartment(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load department details');
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
        <p className="text-sm text-slate-500">Loading department details...</p>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="space-y-4">
        <Link
          href="/departments"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Departments
        </Link>
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="text-sm">{error || 'Department not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/departments"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Departments
        </Link>
      </div>

      {/* Department Info Header */}
      <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-start gap-5">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-100">
                {department.departmentName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Active
              </span>
            </div>
            <p className="text-slate-600 dark:text-zinc-400 text-base leading-relaxed">
              {department.departmentDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Projects under this Department */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            Linked Projects ({department.projects?.length || 0})
          </h2>
        </div>

        {!department.projects || department.projects.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-800 text-slate-500">
            No active projects associated with this department yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {department.projects.map((project) => (
              <Link
                key={project.projectId}
                href={`/projects/${project.projectId}`}
                className="group block p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400">ID #{project.projectId}</span>
                  <ProjectStatusBadge status={project.status} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                  {project.projectName}
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 line-clamp-2 min-h-10">
                  {project.description || 'No description provided.'}
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{project.startDate}</span>
                  </div>
                  <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-1">
                    View Tasks <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
