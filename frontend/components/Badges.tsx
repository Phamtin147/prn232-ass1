import React from 'react';
import { PROJECT_STATUS, TASK_STATUS, TASK_PRIORITY } from '@/lib/constants';
import { Tag } from '@/lib/types';

export const ProjectStatusBadge: React.FC<{ status: number }> = ({ status }) => {
  const info = PROJECT_STATUS[status] || { label: `Status ${status}`, color: 'text-gray-700', bg: 'bg-gray-100' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${info.bg} ${info.color}`}>
      {info.label}
    </span>
  );
};

export const TaskStatusBadge: React.FC<{ status: number }> = ({ status }) => {
  const info = TASK_STATUS[status] || { label: `Status ${status}`, color: 'text-gray-700', bg: 'bg-gray-100' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${info.bg} ${info.color}`}>
      {info.label}
    </span>
  );
};

export const TaskPriorityBadge: React.FC<{ priority: number }> = ({ priority }) => {
  const info = TASK_PRIORITY[priority] || { label: `Priority ${priority}`, color: 'text-gray-700', bg: 'bg-gray-100' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${info.bg} ${info.color}`}>
      {info.label}
    </span>
  );
};

export const TagBadge: React.FC<{ tag: Tag }> = ({ tag }) => {
  const hex = tag.color || '#64748B';
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border"
      style={{
        backgroundColor: `${hex}15`,
        borderColor: `${hex}40`,
        color: hex,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hex }} />
      {tag.tagName}
    </span>
  );
};
