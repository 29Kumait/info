import type {ActionFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {insertEvent} from "~/db/eventStorage.server";
import invariant from "tiny-invariant";

export const action: ActionFunction = async ({ request }) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    const crypto = await import("crypto");

    const payloadText = await request.text();
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery");

    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = request.headers.get("X-Hub-Signature-256");

    if (!webhookSecret) {
        throw new Error("WEBHOOK_SECRET environment variable is not set.");
    }

    if (!signature) {
        return json({ message: "Missing signature" }, 400);
    }

    const generatedSignature = `sha256=${crypto
        .createHmac("sha256", webhookSecret)
        .update(payloadText)
        .digest("hex")}`;

    //  debugging
    console.log("Received signature:", signature);
    console.log("Generated signature:", generatedSignature);

    if (signature !== generatedSignature) {
        return json({ message: "Signature mismatch" }, 401);
    }


    const payload = JSON.parse(payloadText);
    invariant( payload ,"Invalid JSON payload 400" )


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
