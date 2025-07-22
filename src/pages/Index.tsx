import React, { useState } from 'react';
import TimeTracker from '@/components/TimeTracker';
import Timesheet from '@/components/Timesheet';
import MyTasks from '@/components/MyTasks';
import Holidays from '@/components/Holidays';
import TopNavigation from '@/components/TopNavigation';

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

const Index = () => {
  const [activeTab, setActiveTab] = useState('time-tracker');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  const handleTimeLogged = (entry: TimeEntry) => {
    setTimeEntries(prev => [...prev, entry]);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'time-tracker':
        return <TimeTracker onTimeLogged={handleTimeLogged} />;
      case 'timesheet':
        return <Timesheet timeEntries={timeEntries} />;
      case 'my-tasks':
        return <MyTasks />;
      case 'holidays':
        return <Holidays />;
      default:
        return <TimeTracker onTimeLogged={handleTimeLogged} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <TopNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-8 min-h-[calc(100vh-80px)]">
          <div className="tab-content">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
