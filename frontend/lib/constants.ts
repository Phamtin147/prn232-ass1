export const PROJECT_STATUS: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'Not Started', color: 'text-slate-700 dark:text-slate-200', bg: 'bg-slate-100 dark:bg-slate-800' },
  1: { label: 'In Progress', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  2: { label: 'Completed', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  3: { label: 'On Hold', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/40' },
};

export const TASK_STATUS: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'To Do', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800' },
  1: { label: 'In Progress', color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  2: { label: 'Done', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  3: { label: 'Cancelled', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/40' },
};

export const TASK_PRIORITY: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'Low', color: 'text-gray-600 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-800' },
  1: { label: 'Medium', color: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-100 dark:bg-sky-900/40' },
  2: { label: 'High', color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-100 dark:bg-orange-900/40' },
  3: { label: 'Critical', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/40' },
};
