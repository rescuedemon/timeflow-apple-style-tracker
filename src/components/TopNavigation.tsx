import React from 'react';
import { Timer, FileText, CheckSquare, Calendar } from 'lucide-react';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'time-tracker',
      label: 'Time Tracker',
      icon: Timer,
    },
    {
      id: 'timesheet',
      label: 'Timesheet',
      icon: FileText,
    },
    {
      id: 'my-tasks',
      label: 'My Tasks',
      icon: CheckSquare,
    },
    {
      id: 'holidays',
      label: 'Holidays',
      icon: Calendar,
    },
  ];

  return (
    <div className="w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 relative border-b-2 ${
                  isActive 
                    ? 'text-primary border-primary bg-primary/5' 
                    : 'text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-50/50'
                }`}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? 'scale-110 text-primary' : 'text-slate-500'
                }`} />
                <span className={`font-medium ${
                  isActive ? 'text-primary' : 'text-slate-600'
                }`}>
                  {tab.label}
                </span>
                
                {isActive && (
                  <div className="absolute inset-0 bg-primary/5 rounded-t-lg animate-scale-in" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TopNavigation;