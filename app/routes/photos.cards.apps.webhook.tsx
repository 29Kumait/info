import {useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/node";
import {getAllEvents} from "~/db/eventStorage.server";
import EventCard from "~/ui/EventCard";

export async function loader() {
    const events = await getAllEvents();
    return json(events);
}

export default function WebhookRoute() {
    const events = useLoaderData<typeof loader>();

    const categorizedEvents: Record<string, typeof events> = {};

    if (Array.isArray(events)) {
        for (const event of events) {
            const type = event.eventType;
            if (!categorizedEvents[type]) {
                categorizedEvents[type] = [];
            }
            categorizedEvents[type].push(event);
        }
    } else {
        console.error("Events data is not an array:", events);
        return <div>Error: Events data is invalid.</div>;
    }

    return (
        <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-900 drop-shadow-md">Webhook Repository Events</h1>
            <div className="space-y-16">
                {Object.entries(categorizedEvents).map(([eventType, events]) => (
                    <div key={eventType} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold mb-8 text-indigo-700 underline decoration-wavy decoration-indigo-500">
                            {eventType.replace(/_/g, " ").toUpperCase()} Events
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
                            {events.map((event, index) => (
                                <EventCard
                                    key={`${event.id}-${index}`} // Ensure key uniqueness with index fallback
                                    event={event}
                                    className="transition-transform transform hover:scale-110 hover:shadow-2xl hover:bg-gray-50 rounded-lg p-4"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
