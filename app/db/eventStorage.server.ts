import {connectDB} from "./mongoDB.server";
import type {Event , Payload} from "~/types/type";

export async function insertEvent(event: Event): Promise<boolean> {
    const { db } = await connectDB();
    const result = await db.collection("events").insertOne(event);
    return result.acknowledged;
}

export async function getAllEvents(): Promise<Event[]> {
    const { db } = await connectDB();

    const projection = {
        id: 1,
        eventType: 1,
        "payload.repository.name": 1,
        "payload.repository.full_name": 1,
        "payload.repository.html_url": 1,
        "payload.repository.owner.login": 1,
        "payload.repository.fork": 1,
        "payload.pusher.name": 1,
        "payload.pull_request.title": 1,
        "payload.issue.title": 1,
        "payload.timestamp": 1,
    };

    const events = await db
        .collection("events")
        .find({}, { projection })
        .toArray();

    return events.map(event => ({
        id: event.id,
        eventType: event.eventType,
        payload: {
            repository: {
                name: event.payload?.repository?.name || "N/A",
                full_name: event.payload?.repository?.full_name || "N/A",
                html_url: event.payload?.repository?.html_url || "#",
                owner: { login: event.payload?.repository?.owner?.login || "Unknown" },
                fork: event.payload?.repository?.fork ?? false,
            },
            pusher: { name: event.payload?.pusher?.name || null },
            pull_request: { title: event.payload?.pull_request?.title || null },
            issue: { title: event.payload?.issue?.title || null },
            timestamp: event.payload?.timestamp || null,
        } as Payload,
    }));
}

export async function deleteEventById(eventId: string): Promise<boolean> {
    const { db } = await connectDB();
    const result = await db.collection("events").deleteOne({ id: eventId });
    return result.deletedCount > 0;
}
