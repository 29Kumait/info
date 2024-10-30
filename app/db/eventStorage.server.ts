import {connectDB} from "./mongoDB.server";
import invariant from "tiny-invariant";
import type {Event} from "~/types/type";

export async function insertEvent(event: Event): Promise<boolean> {
    const { db } = await connectDB();
    invariant(db, "Failed to connect to the database");

    const result = await db.collection("events").insertOne(event);
    invariant(result.acknowledged, "Failed to insert event into the database");

    return result.acknowledged;
}

export async function getAllEvents(): Promise<Event[]> {
    const { db } = await connectDB();
    const events = await db.collection("events").find({}).toArray();

    return events.map((rest) => ({
        id: rest.id,
        eventType: rest.eventType,
        payload: rest.payload,
    }));
}

export async function deleteEventById(eventId: string): Promise<boolean> {
    const { db } = await connectDB();
    const result = await db.collection("events").deleteOne({ id: eventId });
    return result.deletedCount > 0;
}
