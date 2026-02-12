import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Task } from '../../../types/task';
import type { Membership } from '../../../types/membership';

interface TaskStatsCardsProps {
  tasks: Task[];
  members: Membership[];
}

interface StatCard {
  label: string;
  value: number;
  change: number;
}

export const TaskStatsCards: React.FC<TaskStatsCardsProps> = ({ tasks, members }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isDone).length;
  const pinned = tasks.filter((t) => t.isPinned).length;
  const teamSize = members.length;

  const cards: StatCard[] = [
    { label: 'TOTAL TASKS', value: total, change: 12.5 },
    { label: 'COMPLETED', value: completed, change: 8.3 },
    { label: 'PINNED', value: pinned, change: -2.1 },
    { label: 'TEAM SIZE', value: teamSize, change: 5.7 },
  ];

  return (
    <div className="flex gap-3">
      {cards.map((card) => {
        const isPositive = card.change >= 0;
        const Icon = isPositive ? TrendingUp : TrendingDown;
        const colorClass = isPositive ? 'text-green-primary' : 'text-red-error';

        return (
          <div
            key={card.label}
            className="flex flex-1 flex-col gap-3 border border-border bg-bg-card p-5"
          >
            <span className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
              {card.label}
            </span>
            <span className="font-display text-[32px] font-bold leading-none tracking-tight text-white">
              {card.value}
            </span>
            <div className={`flex items-center gap-1.5 ${colorClass}`}>
              <Icon size={12} />
              <span className="font-mono text-[11px] font-medium">
                {isPositive ? '+' : ''}
                {card.change}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
