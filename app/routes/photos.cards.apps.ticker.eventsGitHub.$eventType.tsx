import { LoaderFunctionArgs, ActionFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import Masonry from 'react-masonry-css';
import { getAllEvents, getEventById } from '~/db/eventStorage.server';
import EventCard from '~/ui/EventCard';


export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.eventType, 'Expected params.eventType');
    const events = await getAllEvents();
    const eventTypesArray = Array.from(new Set(events.map((e) => e.eventType)));
    const filteredEvents = events.filter(
        (event) => event.eventType === params.eventType
    );

    return {
        events: filteredEvents,
        eventTypes: eventTypesArray,
        currentType: params.eventType,
    };
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const closeModal = formData.get('closeModal');
    const eventId = formData.get('eventId');

    if (closeModal === 'true') {
        return ({ event: null });
    }

    if (!eventId || typeof eventId !== 'string') {
        return ({ error: 'Invalid event ID' });
    }

    const event = await getEventById(eventId);
    return ({ event });
};

export default function EventsByType() {
    const { events, currentType } = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                {currentType.replace(/_/g, ' ').toUpperCase()}
            </h1>

            {/* Navigation Tabs */}
            {/* <Tabs eventTypes={eventTypes} /> */}

            {/* Event Cards */}
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
        </div>
    );
}
