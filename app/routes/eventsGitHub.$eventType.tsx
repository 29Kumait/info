import type {ActionFunctionArgs , LoaderFunctionArgs} from '@remix-run/node';
import {json} from '@remix-run/node';
import {useFetcher , useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {getAllEvents , getEventById} from '~/db/eventStorage.server';
import EventCard from '~/ui/EventCard';
import Masonry from 'react-masonry-css';
import Modal from '~/ui/Modal';
import EventContent from '~/ui/EventContent';
import type {Event} from '~/types/type';
import Tabs from "~/ui/Tabs";

interface ActionData {
    event?: Event | null;
    error?: string;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.eventType, 'Expected params.eventType');
    const events = await getAllEvents();
    const eventTypesArray = Array.from(new Set(events.map((e) => e.eventType)));
    const filteredEvents = events.filter((event) => event.eventType === params.eventType);

    return json({
        events: filteredEvents,
        eventTypes: eventTypesArray,
        currentType: params.eventType,
    });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const closeModal = formData.get('closeModal');
    const eventId = formData.get('eventId');

    if (closeModal === 'true') {
        return json<ActionData>({ event: null });
    }

    if (!eventId || typeof eventId !== 'string') {
        return json<ActionData>({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await getEventById(eventId);
    return json<ActionData>({ event });
};

export default function EventsByType() {
    const { events, eventTypes, currentType } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<ActionData>();

    const isModalOpen = !!fetcher.data?.event;

    const handleCloseModal = () => {
        const formData = new FormData();
        formData.append('closeModal', 'true');
        fetcher.submit(formData, { method: 'post' });
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                {currentType.replace(/_/g, ' ').toUpperCase()}
            </h1>

            {/* Navigation Tabs */}
<Tabs eventTypes={eventTypes}  />

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
                    <EventCard key={event.id} event={event} fetcher={fetcher} />
                ))}
            </Masonry>

            {/* Event Modal */}
            {isModalOpen && fetcher.data?.event && (
                <Modal isOpen={true} onClose={handleCloseModal}>
                    <EventContent event={fetcher.data.event} />
                </Modal>
            )}
        </div>
    );
}
