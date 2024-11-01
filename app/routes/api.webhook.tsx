import {ActionFunctionArgs , json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {getAllEvents , insertEvent} from "~/db/eventStorage.server";


export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, { status: 405 });
    }

    const crypto = await import("crypto");
    const payloadText = await request.text();
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery") || "unknown";

    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = request.headers.get("X-Hub-Signature-256");

    if (!webhookSecret) {
        throw new Response("WEBHOOK_SECRET environment variable is not set.", {
            status: 500,
        });
    }

    const generatedSignature = `sha256=${crypto
        .createHmac("sha256", webhookSecret)
        .update(payloadText)
        .digest("hex")}`;

    if (signature !== generatedSignature) {
        return json({ message: "Signature mismatch" }, { status: 401 });
    }

    const payload = await request.json();

    const success = await insertEvent({
        id: deliveryId,
        eventType,
        payload,
    });

    if (!success) {
        return json({ message: "Failed to save event" }, { status: 500 });
    }

    return json({ success: true, id: deliveryId }, { status: 201 });
}

export async function loader() {
    const events = await getAllEvents();
    return json(events);
}

export default function WebhookRoute() {
    const events = useLoaderData<typeof loader>();

    return (
        <div>
            <h1>GitHub Events</h1>
                {events.map((event) => (
                    <ul key={event.id}>
                        <li> ID : {event.id}</li>
                        <li>Event Type: {event.eventType}</li>
                        <li>Repository: {event.payload.repository?.name}</li>
                    </ul>
                ))}
        </div>
    );
}