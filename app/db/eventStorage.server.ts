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
                name: event.payload?.repository?.name,
            },
        } as Payload,
    }));
}

export async function deleteEventById(eventId: string): Promise<boolean> {
    const { db } = await connectDB();
    const result = await db.collection("events").deleteOne({ id: eventId });
    return result.deletedCount > 0;
}
