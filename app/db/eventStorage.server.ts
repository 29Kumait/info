import {connectDB} from "./mongoDB.server";

interface Event {
    id: string;
    eventType: string;
    payload: string;
}

export async function insertEvent(event: Event): Promise<boolean> {
    const { db } = await connectDB();
    const result = await db.collection("events").insertOne(event);
    return result.acknowledged;
}

export async function getAllEvents(): Promise<Event[]> {
    const { db } = await connectDB();
    const events = await db.collection("events").find({}).toArray();

    return events.map(({ _id, ...rest }) => ({
        id: rest.id,
        eventType: rest.eventType,
        payload: rest.payload
    } as Event));
}

export async function deleteEventById(eventId: string): Promise<boolean> {
    const { db } = await connectDB();
    const result = await db.collection("events").deleteOne({ id: eventId });
    return result.deletedCount > 0;
}
