import React, { useState } from 'react';
import TimeTracker from '@/components/TimeTracker';
import Timesheet from '@/components/Timesheet';
import MyTasks from '@/components/MyTasks';
import Holidays from '@/components/Holidays';
import BottomNavigation from '@/components/BottomNavigation';

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
    <div className="min-h-screen pb-24">
      <div className="max-w-md mx-auto h-screen">
        <div className="h-full p-4 pt-8">
          <div className="tab-content">
            {renderActiveTab()}
          </div>
        </div>
      </div>
      
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Index;
