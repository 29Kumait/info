import {json , LoaderFunction} from "@remix-run/node";
import {getAllEvents} from "~/db/eventStorage.server";
import type {FC} from "react";
import type {EventData , EventType} from "~/types/type";

interface EventCardProps {
    eventType: EventType;
    eventData: EventData;
}

export const loader: LoaderFunction = async () => {
    const events = await getAllEvents();
    return json(events);
};

const EventCard: FC<EventCardProps> = ({ eventType }) => {
    const getEventDescription = (eventType: EventType) => {
        switch (eventType) {
            case "push":
                return "Push Event";
            default:
                return "Unknown Event";
        }
    };


    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">{getEventDescription(eventType)}</h2>
        </div>
    );
};

export default EventCard;