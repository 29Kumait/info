import {ActionFunctionArgs , json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {getAllEvents , insertEvent} from "~/db/eventStorage.server";
import {sanitizeEventData} from "~/utils/sanitizeData";
import {format} from "date-fns";

// Action function to handle incoming GitHub webhooks
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
    const sanitizedPayload = sanitizeEventData(payload);

    const success = await insertEvent({
        id: deliveryId,
        eventType,
        payload: sanitizedPayload,
    });

    if (!success) {
        return json({ message: "Failed to save event" }, { status: 500 });
    }

    return json({ success: true, id: deliveryId }, { status: 201 });
}

// Loader function to fetch all events
export async function loader() {
    const events = await getAllEvents();
    return json(events);
}

interface Repository {
    name?: string;
}

interface Pusher {
    name?: string;
}

interface PullRequest {
    title?: string;
}

interface Issue {
    title?: string;
}

interface Payload {
    timestamp?: string;
    repository?: Repository;
    pusher?: Pusher;
    pull_request?: PullRequest;
    issue?: Issue;
}

interface Event {
    id: string;
    eventType: string;
    payload?: Payload; // Make payload optional
}

interface EventCardProps {
    event: Event;
}

// Helper function for styling based on event type
function getEventTypeStyle(eventType: string): string {
    const typeStyles: Record<string, string> = {
        push: "border-blue-500 bg-blue-50",
        pull_request: "border-green-500 bg-green-50",
        issues: "border-yellow-500 bg-yellow-50",
        issue_comment: "border-purple-500 bg-purple-50",
        fork: "border-pink-500 bg-pink-50",
        star: "border-orange-500 bg-orange-50",
        default: "border-gray-500 bg-gray-50",
    };
    return typeStyles[eventType] || typeStyles.default;
}

// EventCard Component
function EventCard({ event }: EventCardProps) {
    const formattedDate = event.payload?.timestamp
        ? format(new Date(event.payload.timestamp), "PPP p")
        : "No date available";

    const eventStyle = getEventTypeStyle(event.eventType);

    return (
        <div className={`shadow-md rounded-lg p-4 border-l-4 ${eventStyle}`}>
            <div className="text-lg font-semibold mb-2">
                {event.eventType.replace(/_/g, " ").toUpperCase()}
            </div>
            <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
            <ul className="text-gray-700">
                <li className="mb-1">
                    <strong>ID:</strong> {event.id}
                </li>
                <li className="mb-1">
                    <strong>Repository:</strong> {event.payload?.repository?.name || "N/A"}
                </li>
                {event.payload?.pusher?.name && (
                    <li className="mb-1">
                        <strong>Pushed by:</strong> {event.payload.pusher.name}
                    </li>
                )}
                {event.eventType === "pull_request" && event.payload?.pull_request?.title && (
                    <li className="mb-1">
                        <strong>PR Title:</strong> {event.payload.pull_request.title}
                    </li>
                )}
                {event.eventType === "issues" && event.payload?.issue?.title && (
                    <li className="mb-1">
                        <strong>Issue:</strong> {event.payload.issue.title}
                    </li>
                )}
            </ul>
        </div>
    );
}

// Main component rendering all events
export default function WebhookRoute() {
    const events = useLoaderData<typeof loader>();

    // Categorizing events by event type for organization
    const categorizedEvents = events.reduce((acc, event) => {
        const type = event.eventType;
        if (!acc[type]) acc[type] = [];
        acc[type].push(event);
        return acc;
    }, {} as Record<string, typeof events>);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">GitHub Events</h1>
            <div className="space-y-8">
                {Object.entries(categorizedEvents).map(([eventType, events]) => (
                    <div key={eventType}>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            {eventType.replace(/_/g, " ").toUpperCase()} Events
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
