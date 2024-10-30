import {Form , useLoaderData} from "@remix-run/react";
import type {FC} from "react";
import EventCard from "./api.webhook.eventCard";
import type {Event} from "~/types/type";

interface LoaderData {
    events: Event[];
}

const EventList: FC = () => {
    const { events } = useLoaderData<LoaderData>();

    return (
        <div>
            {events.map((event) => (
                <div key={event.id} className="mb-4">
                    <EventCard eventType={event.eventType} eventData={JSON.parse(event.payload)} />
                    <Form method="delete" action={`/api/webhook/${event.id}`}>
                        <button type="submit" className="text-red-500">
                            Delete
                        </button>
                    </Form>
                </div>
            ))}
        </div>
    );
};

export default EventList;
