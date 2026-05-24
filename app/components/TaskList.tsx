import { Task } from '@/app/types/Tasks';
import { TaskCard } from './TaskCard';
import { ListTodo } from 'lucide-react';
import { TaskListSkeleton } from './TaskSkeleton';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
}

export function TaskList({ tasks, isLoading, error }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <TaskListSkeleton />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
        <p className="text-sm text-red-500 font-medium">Error loading tasks</p>
        <p className="text-xs text-red-400/80 max-w-md">{error.message}</p>
        <details className="mt-4 text-left">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
            Technical details
          </summary>
          <pre className="mt-2 text-xs text-gray-600 bg-gray-900/50 p-3 rounded border border-gray-800 overflow-auto max-w-md">
            {error.stack || JSON.stringify(error, null, 2)}
          </pre>
        </details>
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-900/50 border border-gray-800/50 flex items-center justify-center mb-4">
          <ListTodo className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">
          No tasks yet
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Submit a website URL and question above to start analyzing websites with AI.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
