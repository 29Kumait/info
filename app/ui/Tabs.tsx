import { NavLink } from "@remix-run/react";

interface TabsProps {
    eventTypes: string[];
}

export default function Tabs({ eventTypes }: TabsProps) {
    return (
        <nav className="flex space-x-4 mb-8 border-b border-gray-300 justify-center">
            {eventTypes.map((eventType) => (
                <NavLink
                    key={eventType}
                    prefetch="intent"
                    to={normalizeEventType(eventType)}
                    preventScrollReset
                    className={({ isActive }) =>
                        `pb-2 text-lg font-medium transition ${
                            isActive
                                ? "border-b-2 border-indigo-600 text-indigo-600"
                                : "text-gray-500 hover:text-indigo-600"
                        }`
                    }
                >
                    {formatEventType(eventType)}
                </NavLink>
            ))}
        </nav>
    );
}

function normalizeEventType(eventType: string): string {
    return `/${eventType.toLowerCase().replace(/\s+/g, "_")}`;
}

function formatEventType(eventType: string): string {
    return eventType.replace(/_/g, " ").toUpperCase();
}
