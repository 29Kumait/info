// app/routes/webhook.$eventType.tsx
import {json , LoaderFunctionArgs} from "@remix-run/node";
import {NavLink , useLoaderData} from "@remix-run/react";
import invariant from "tiny-invariant";
import {getAllEvents} from "~/db/eventStorage.server";
import EventCard from "~/ui/EventCard";
import Masonry from "react-masonry-css";


export async function loader({ params }: LoaderFunctionArgs) {
    invariant(params.eventType, "Expected params.eventType");

    const events = await getAllEvents();
    const eventTypesArray = [...new Set(events.map((e) => e.eventType))];
    const [firstEventType] = eventTypesArray;

    const filteredEvents = events.filter(
        (event) => event.eventType === params.eventType
    );

    return json({
        events: filteredEvents,
        eventTypes: eventTypesArray,
        currentType: params.eventType,
        firstEventType,
    });
}


export default function EventsByType() {
    const { events, eventTypes, currentType } = useLoaderData<typeof loader>();

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                {currentType}
            </h1>
            <div className="flex space-x-4 mb-8 border-b border-gray-200">
                {eventTypes.map((eventType) => (
                    <NavLink
                        key={eventType}
                        prefetch="intent"
                        to={`/webhook/${eventType}`}
                        preventScrollReset
                        className={({ isActive }) =>
                            `pb-2 text-lg font-medium ${
                                isActive
                                    ? "border-b-2 border-indigo-600 text-indigo-600"
                                    : "text-gray-600 hover:text-indigo-600"
                            }`
                        }
                    >
                        {eventType.replace(/_/g, ' ').toUpperCase()}
                    </NavLink>
                ))}
            </div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -mx-2"
                columnClassName="masonry-grid_column space-y-4"
            >
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </Masonry>
        </div>
    );
}
