import {connectDB} from "./mongoDB.server";
import type {Event} from "~/types/type";

export async function insertEvent(event: Event): Promise<boolean> {
    const { db } = await connectDB();
    const result = await db.collection("events").insertOne(event);
    return result.acknowledged;
}

export async function getAllEvents(): Promise<Event[]> {
    const { db } = await connectDB();
    const events = await db.collection("events").find({}).toArray()
       return events as unknown as  Event[];
}

export async function getEventById(eventId: string): Promise<Event | null> {
         const { db } = await connectDB();
         const event = await db.collection("events").findOne({ id: eventId });
         return event as unknown as Event;

export async function deleteEventById(eventId: string): Promise<boolean> {
    const { db } = await connectDB();
    const result = await db.collection("events").deleteOne({ id: eventId });
    return result.deletedCount > 0;
}