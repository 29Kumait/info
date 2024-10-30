import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getAllEvents } from "~/db/eventStorage.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    const events = await getAllEvents();
    return json({ events });
};

export default function EventListPage() {
    const { events } = useLoaderData<typeof loader>();

    return (
        <div>
            <h1>GitHub Webhook Events</h1>
            <ul>
                {events.map((event: { id: string; eventType: string; payload: string }) => (                    <li key={event.id}>
                        <h2>{event.eventType}</h2>
                        <p>{event.payload}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
