import type {ActionFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {insertEvent} from "~/db/eventStorage.server";

export const action: ActionFunction = async ({ request }) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    const payload = await request.text();
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery");

    const generatedSignature = process.env.GENERATED_SIGNATURE;
    const signature = request.headers.get("X-Hub-Signature-256");

    if (!generatedSignature) {
        throw new Error("GENERATED_SIGNATURE environment variable is not set.");
    }

    if (!signature || signature !== `sha256=${generatedSignature}`) {
        return json({ message: "Signature mismatch" }, 401);
    }

    const success = await insertEvent({
        id: deliveryId || "unknown",
        eventType,
        payload,
    });

    if (!success) {
        return json({ message: "Failed to save event" }, 500);
    }

    return json({ success: true, id: deliveryId }, 201);
};

export default function WebhookRoute() {
    return null;
}