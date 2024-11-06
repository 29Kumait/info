import {json , LoaderFunction , redirect} from "@remix-run/node";
import {getAllEvents} from "~/db/eventStorage.server";
import {Outlet} from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
    const events = await getAllEvents();
    const eventTypes = [...new Set(events.map((e) => e.eventType))];

    const [firstEventType] = eventTypes;

    const url = new URL(request.url);
    if (firstEventType && !url.pathname.includes(firstEventType)) {
        return redirect(`/eventsGitHub/${firstEventType}`);
    }

    return json({ eventTypes });
};

export default function EventsGitHub() {
    return (
        <>
        <div>
            {/*<div className="flex flex-col items-center justify-center min-h-screen py-2">*/}
                <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                    Repository Github Webhook Events
                </h1>
            </div>
            <div className="container mx-auto p-8 bg-gray-50 rounded-lg">
                <Outlet/>
            </div>
        </>

    )
}


