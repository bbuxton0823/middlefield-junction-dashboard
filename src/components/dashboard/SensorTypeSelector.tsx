'use client';

import { useState } from 'react';

interface SensorTypeSelectorProps {
  selected: string[];
  onChange: (types: string[]) => void;
}

const sensorTypes = [
  { value: 'STREETLIGHT', label: 'Streetlights', color: 'bg-yellow-500' },
  { value: 'PEDESTRIAN', label: 'Pedestrian', color: 'bg-blue-500' },
  { value: 'TRAFFIC', label: 'Traffic', color: 'bg-red-500' },
  { value: 'ENVIRONMENTAL', label: 'Environment', color: 'bg-green-500' },
];

export default function SensorTypeSelector({ selected, onChange }: SensorTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(type => type !== value)
      : [...selected, value];
    
    onChange(newSelected);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Sensor Types</span>
        <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {sensorTypes.map((type) => (
              <div
                key={type.value}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleToggle(type.value)}
              >
                <div className="flex items-center h-5">
                  <input
                    id={`sensor-${type.value}`}
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={selected.includes(type.value)}
                    onChange={() => handleToggle(type.value)}
                  />
                </div>
                <div className="ml-3 flex items-center">
                  <div className={`mr-2 h-3 w-3 rounded-full ${type.color}`}></div>
                  <label htmlFor={`sensor-${type.value}`} className="font-medium">
                    {type.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 