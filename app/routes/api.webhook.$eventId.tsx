import {ActionFunctionArgs , json} from "@remix-run/node";
import {deleteEventById} from "~/db/eventStorage.server";


export const action = async ({ request, params }: ActionFunctionArgs) => {
    if (request.method !== "DELETE") {
        return json({ message: "Method not allowed" }, 405);
    }

    const { eventId } = params;
    if (!eventId) {
        return json({ message: "Invalid event ID" }, 400);
    }

    const deleted = await deleteEventById(eventId);
    if (!deleted) {
        return json({ message: `No event with ID ${eventId} found` }, 404);
    }

    return json({ message: `Event ${eventId} deleted` }, 200);
};
