import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, Outlet } from '@remix-run/react';
import invariant from 'tiny-invariant';
import Masonry from 'react-masonry-css';
import { getAllEvents } from '~/db/eventStorage.server';
import EventCard from '~/ui/EventCard';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.eventType, 'Expected params.eventType');
    const events = await getAllEvents();
    const filteredEvents = events.filter(
        (event) => event.eventType === params.eventType
    );

    return {
        events: filteredEvents,
        currentType: params.eventType,
    };
};

export default function EventsByType() {
    const { events, currentType } = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                {currentType.replace(/_/g, ' ').toUpperCase()}
            </h1>

            <Masonry
                breakpointCols={{
                    default: 3,
                    1100: 2,
                    700: 1,
                }}
                className="flex -mx-2"
                columnClassName="masonry-grid_column space-y-4"
            >
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </Masonry>
            <Outlet />
        </div>
    );
}
