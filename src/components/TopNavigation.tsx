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
    <div className="w-full bg-transparent py-6">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 text-base font-semibold transition-all duration-300 rounded-2xl flex-1 justify-center ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                    : 'bg-white/60 backdrop-blur-sm text-slate-600 hover:bg-white/80 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`} />
                <span className={`font-semibold ${
                  isActive ? 'text-white' : 'text-slate-600'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;