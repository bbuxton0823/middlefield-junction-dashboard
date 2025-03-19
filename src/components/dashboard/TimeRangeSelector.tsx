'use client';

import { TimeRange } from '@/types';

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: 'Last 24h', value: '24h' },
  { label: 'Last 7d', value: '7d' },
  { label: 'Last 30d', value: '30d' },
  { label: 'Last Year', value: '1y' },
];

export default function TimeRangeSelector({ selected, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            selected === range.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
} 