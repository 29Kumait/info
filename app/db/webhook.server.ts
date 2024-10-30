// import type { ActionFunctionArgs } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import crypto from "crypto";
// import { insertEvent } from "~/db/eventStorage.server";
//
// export const action = async ({ request }: ActionFunctionArgs) => {
//     if (request.method !== "POST") {
//         return json({ message: "Method not allowed" }, 405);
//     }
//
//     const payload = await request.text();
//     const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
//     const deliveryId = request.headers.get("X-GitHub-Delivery");
//
//     const webhookSecret = process.env.WEBHOOK_SECRET;
//     const secretHeader = request.headers.get("X-Hub-Signature-256");
//
//     if (!webhookSecret) {
//         throw new Error("WEBHOOK_SECRET environment variable is not set.");
//     }
//
//     const generatedSignature = `sha256=${crypto
//         .createHmac("sha256", webhookSecret)
//         .update(payload)
//         .digest("hex")}`;
//
//     if (!secretHeader || secretHeader !== generatedSignature) {
//         return json({ message: "Unauthorized request" }, 401);
//     }
//
//     const success = await insertEvent({
//         id: deliveryId || "unknown",
//         eventType,
//         payload,
//     });
//
//     if (!success) {
//         return json({ message: "Failed to save event" }, 500);
//     }
//
//     return json({ success: true, id: deliveryId }, 201);
// };


import crypto from "crypto";
import {insertEvent} from "./eventStorage.server";
import {json} from "@remix-run/node";

export interface Event {
    id: string;
    eventType: string;
    payload: string;
}

export async function processWebhook(request: Request) {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    const payload = await request.text();
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery");

    const webhookSecret = process.env.WEBHOOK_SECRET;
    const secretHeader = request.headers.get("X-Hub-Signature-256");

    if (!webhookSecret) {
        throw new Error("WEBHOOK_SECRET environment variable is not set.");
    }

    const generatedSignature = `sha256=${crypto
        .createHmac("sha256", webhookSecret)
        .update(payload)
        .digest("hex")}`;

    if (!secretHeader || secretHeader !== generatedSignature) {
        return json({ message: "Unauthorized request" }, 401);
    }

    const event: Event = {
        id: deliveryId || "unknown",
        eventType,
        payload,
    };

    const success = await insertEvent(event);

    if (!success) {
        return json({ message: "Failed to save event" }, 500);
    }

    return json({ success: true, id: deliveryId }, 201);
}
