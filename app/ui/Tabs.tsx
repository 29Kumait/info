import { NavLink } from "@remix-run/react";

interface TabsProps {
    eventTypes: string[];
}

export default function Tabs({ eventTypes }: TabsProps) {
    return (
        <nav className="flex space-x-4 mb-8 border-b border-gray-200 justify-center">
            {eventTypes.map((eventType) => (
                <NavLink
                    key={eventType}
                    prefetch="intent"
                    to={normalizeEventType(`/${eventType}`)}
                    preventScrollReset
                    className={({ isActive }) =>
                        `pb-2 text-lg font-medium ${isActive
                            ? 'border-b-2 border-indigo-600 text-indigo-600'
                            : 'text-gray-600 hover:text-indigo-600'
                        }`
                    }
                >
                    {eventType.replace(/_/g, ' ').toUpperCase()}
                </NavLink>
            ))}
        </nav>
    );
}

function normalizeEventType(eventType: string): string {
    return eventType.toLowerCase().replace(/\s+/g, '_');
}
