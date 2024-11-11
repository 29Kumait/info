import { Outlet, useLoaderData } from '@remix-run/react';
import { getAllEvents } from '~/db/eventStorage.server';
import Tabs from '~/ui/Tabs';

export const loader = async () => {
    const events = await getAllEvents();
    const eventTypesArray = Array.from(new Set(events.map((e) => e.eventType)));
    return ({ eventTypes: eventTypesArray });
};

export default function EventsIndex() {
    const { eventTypes } = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-8 bg-zinc-50">
            <h1 className=" mt-10 text-3xl font-bold text-center mb-10 text-gray-800">
                Repository Github Webhook Events
            </h1>
            <Tabs eventTypes={eventTypes} />
            <Outlet />
        </div>
    );
}
