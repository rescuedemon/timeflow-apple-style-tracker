import React, { useState } from 'react';
import { Calendar, Clock, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalTime: string;
  project: string;
  subproject: string;
  description: string;
}

interface TimesheetProps {
  timeEntries: TimeEntry[];
}

const Timesheet: React.FC<TimesheetProps> = ({ timeEntries }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate total hours for progress bar
  const calculateTotalHours = () => {
    const today = new Date().toDateString();
    const todayEntries = timeEntries.filter(entry => entry.date === today);
    
    let totalMinutes = 0;
    todayEntries.forEach(entry => {
      const [hours, minutes, seconds] = entry.totalTime.split(':').map(Number);
      totalMinutes += hours * 60 + minutes + Math.round(seconds / 60);
    });
    
    return totalMinutes / 60; // Convert to hours
  };

  const totalHours = calculateTotalHours();
  const progressPercentage = Math.min((totalHours / 8) * 100, 100);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayEntries = () => {
    const dateString = currentDate.toDateString();
    return timeEntries.filter(entry => entry.date === dateString);
  };

  const getWeekEntries = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });
  };

  const aggregateWeeklyData = () => {
    const weekEntries = getWeekEntries();
    const projectTotals: { [key: string]: number } = {};
    
    weekEntries.forEach(entry => {
      const [hours, minutes] = entry.totalTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const projectKey = `${entry.project} - ${entry.subproject}`;
      
      if (!projectTotals[projectKey]) {
        projectTotals[projectKey] = 0;
      }
      projectTotals[projectKey] += totalMinutes;
    });

    return Object.entries(projectTotals).map(([project, minutes]) => ({
      project,
      totalTime: `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}:00`
    }));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'daily') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Progress Bar - Full Width */}
      <div className="w-full mb-8">
        <div className="max-w-7xl mx-auto px-8">
          <Card className="p-8 bg-white/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-700 font-display">Daily Progress</h3>
                  <p className="text-base text-slate-500 font-system">Target: 8 hours</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-700 font-mono">
                  {totalHours.toFixed(1)} / 8.0 hours
                </div>
                <div className="text-base text-slate-500 font-system">
                  {progressPercentage.toFixed(0)}% complete
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Progress 
                value={progressPercentage} 
                className="h-6 bg-slate-200"
              />
              <div 
                className="absolute top-0 left-0 h-6 rounded-lg progress-fill"
                style={{ 
                  width: `${progressPercentage}%`,
                  background: progressPercentage >= 100 
                    ? 'linear-gradient(90deg, #10B981, #059669)' 
                    : 'linear-gradient(90deg, #8B5CF6, #7C3AED)'
                }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Single Container with Toggle and Content */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-8">
          <Card className="p-8 bg-white/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl">
            {/* View Toggle */}
            <div className="flex bg-slate-100/80 rounded-2xl p-1 mb-8">
              <Button
                variant={viewMode === 'daily' ? 'default' : 'ghost'}
                onClick={() => setViewMode('daily')}
                className={`flex-1 rounded-xl font-medium font-system transition-all duration-300 ${
                  viewMode === 'daily' 
                    ? 'bg-white shadow-lg text-purple-600' 
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Daily View
              </Button>
              <Button
                variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                onClick={() => setViewMode('weekly')}
                className={`flex-1 rounded-xl font-medium font-system transition-all duration-300 ${
                  viewMode === 'weekly' 
                    ? 'bg-white shadow-lg text-purple-600' 
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Weekly View
              </Button>
            </div>

            {/* Date Navigation */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-700 font-display">
                {viewMode === 'daily' ? 'Daily Timesheet' : 'Weekly Summary'}
              </h2>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                  className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white/90 font-system"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="text-center min-w-[200px]">
                  <div className="font-semibold text-slate-700 font-system">
                    {viewMode === 'daily' ? formatDate(currentDate) : 
                     `Week of ${formatDate(new Date(currentDate.getTime() - currentDate.getDay() * 24 * 60 * 60 * 1000))}`}
                  </div>
                  {isToday(currentDate) && viewMode === 'daily' && (
                    <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-700 font-system">
                      Today
                    </Badge>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                  className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white/90 font-system"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Time Entries Content */}
            <div className="overflow-y-auto max-h-96">
              {viewMode === 'daily' ? (
                <div className="space-y-3">
                  {getDayEntries().length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2 font-system">No time entries for this day</p>
                      <p className="text-sm font-system">Start tracking time to see entries here</p>
                    </div>
                  ) : (
                    getDayEntries().map((entry) => (
                      <Card key={entry.id} className="p-4 hover-lift bg-white/70 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-system">
                                {entry.project}
                              </Badge>
                              <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-system">
                                {entry.subproject}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 font-system">
                              <span className="font-mono">{entry.startTime} - {entry.endTime}</span>
                              <span className="font-semibold text-purple-600 font-mono">{entry.totalTime}</span>
                            </div>
                            {entry.description && (
                              <p className="text-sm text-slate-500 mt-2 font-system">{entry.description}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {aggregateWeeklyData().length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2 font-system">No time entries for this week</p>
                      <p className="text-sm font-system">Start tracking time to see weekly summary</p>
                    </div>
                  ) : (
                    aggregateWeeklyData().map((item, index) => (
                      <Card key={index} className="p-4 hover-lift bg-white/70 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-700 mb-1 font-display">{item.project}</h4>
                            <div className="text-sm text-slate-600 font-system">
                              <span className="font-semibold text-purple-600 font-mono">{item.totalTime}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timesheet;