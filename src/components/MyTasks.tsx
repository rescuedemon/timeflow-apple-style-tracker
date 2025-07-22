import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Star, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  estimatedTime?: string;
}

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design new component library',
      description: 'Create reusable components for the design system',
      project: 'Design System',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-07-25',
      estimatedTime: '8h'
    },
    {
      id: '2',
      title: 'Implement authentication flow',
      description: 'Build login, register, and password reset functionality',
      project: 'Frontend Development',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-07-24',
      estimatedTime: '6h'
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all endpoints with examples',
      project: 'Backend Development',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-07-26',
      estimatedTime: '4h'
    },
    {
      id: '4',
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment',
      project: 'DevOps',
      priority: 'low',
      status: 'completed',
      estimatedTime: '3h'
    }
  ]);

  const currentTask = tasks.find(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="w-3 h-3 fill-current" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <Circle className="w-3 h-3" />;
      default: return null;
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.status === 'completed') {
            return { ...task, status: 'pending' };
          } else if (task.status === 'pending') {
            return { ...task, status: 'in-progress' };
          } else {
            return { ...task, status: 'completed' };
          }
        }
        return task;
      })
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="h-full flex flex-col animate-fade-up space-y-6">
      {/* Current Task */}
      {currentTask && (
        <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200/50 backdrop-blur-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-glow"></div>
              <h3 className="text-lg font-semibold text-slate-700">Current Task</h3>
            </div>
            <Badge variant="outline" className={getPriorityColor(currentTask.priority)}>
              {getPriorityIcon(currentTask.priority)}
              <span className="ml-1 capitalize">{currentTask.priority}</span>
            </Badge>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-xl font-semibold text-slate-800">{currentTask.title}</h4>
            <p className="text-slate-600">{currentTask.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/50">
                {currentTask.project}
              </Badge>
              {currentTask.estimatedTime && (
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>{currentTask.estimatedTime}</span>
                </div>
              )}
              {currentTask.dueDate && (
                <div className={`flex items-center gap-1 ${
                  isOverdue(currentTask.dueDate) ? 'text-red-600' : 'text-slate-500'
                }`}>
                  <span>Due {formatDate(currentTask.dueDate)}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => toggleTaskStatus(currentTask.id)}
                variant="default"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Pending Tasks */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-700">
            Pending Tasks ({pendingTasks.length})
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl bg-white/70 hover:bg-white/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {pendingTasks.map((task) => (
            <Card key={task.id} className="p-4 hover-lift bg-white/80 backdrop-blur-lg">
              <div className="flex items-start gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-1 p-0 h-6 w-6 rounded-full hover:bg-primary/10"
                >
                  <Circle className="w-5 h-5 text-slate-400 hover:text-primary" />
                </Button>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-700">{task.title}</h4>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {getPriorityIcon(task.priority)}
                      <span className="ml-1 capitalize">{task.priority}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="secondary" className="bg-slate-100">
                      {task.project}
                    </Badge>
                    {task.estimatedTime && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimatedTime}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className={`flex items-center gap-1 ${
                        isOverdue(task.dueDate) ? 'text-red-600' : 'text-slate-500'
                      }`}>
                        <span>Due {formatDate(task.dueDate)}</span>
                        {isOverdue(task.dueDate) && (
                          <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Completed Tasks ({completedTasks.length})
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {completedTasks.map((task) => (
                <Card key={task.id} className="p-4 bg-green-50/50 backdrop-blur-lg border-green-200/50">
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-1 p-0 h-6 w-6 rounded-full"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-700 line-through opacity-75">
                          {task.title}
                        </h4>
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Completed
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-500 mb-2 line-through opacity-75">
                        {task.description}
                      </p>
                      
                      <Badge variant="secondary" className="bg-white/50 text-slate-500">
                        {task.project}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;