import React from 'react';
import { JobApplication } from '../types/job';

interface ApplicationTimelineProps {
  application: JobApplication;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  application,
}) => {
  const events = React.useMemo(() => {
    const timeline = [
      {
        date: new Date(application.appliedDate),
        title: '提交申请',
        description: '您的申请已提交，等待审核',
        status: 'completed',
      },
    ];

    if (application.reviewedDate) {
      timeline.push({
        date: new Date(application.reviewedDate),
        title: '申请审核',
        description: '您的申请已被审核',
        status: 'completed',
      });
    }

    if (application.status === 'accepted') {
      timeline.push({
        date: new Date(application.reviewedDate || application.appliedDate),
        title: '申请通过',
        description: '恭喜！您的申请已被接受',
        status: 'completed',
      });
    } else if (application.status === 'rejected') {
      timeline.push({
        date: new Date(application.reviewedDate || application.appliedDate),
        title: '申请未通过',
        description: application.notes || '很遗憾，您的申请未被接受',
        status: 'completed',
      });
    }

    return timeline.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [application]);

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      event.status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.title}{' '}
                      <span className="font-medium text-gray-900">
                        {event.description}
                      </span>
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={event.date.toISOString()}>
                      {event.date.toLocaleString()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 