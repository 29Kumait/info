import {ActionFunctionArgs , json} from "@remix-run/node";
import {insertEvent} from "~/db/eventStorage.server";
import {sanitizeEventData} from "~/utils/sanitizeData";
import type {Event} from "~/types/type";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, { status: 405 });
    }

    const crypto = await import("crypto");
    const payloadText = await request.text();
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery") || "unknown";

    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = request.headers.get("X-Hub-Signature-256");

    if (!webhookSecret) {
        throw new Response("WEBHOOK_SECRET environment variable is not set.", {
            status: 500,
        });
    }

    const generatedSignature = `sha256=${crypto
        .createHmac("sha256", webhookSecret)
        .update(payloadText)
        .digest("hex")}`;

    if (signature !== generatedSignature) {
        return json({ message: "Signature mismatch" }, { status: 401 });
    }

    const payload = await request.json();

    const sanitizedPayload = sanitizeEventData(payload);


    const event: Event = {
        id: deliveryId,
        eventType,
        payload: {
            repository: sanitizedPayload.repository,
            pusher: sanitizedPayload.pusher,
            pull_request: sanitizedPayload.pull_request,
            issue: sanitizedPayload.issue,
            commits: sanitizedPayload.commits,
            timestamp: sanitizedPayload.timestamp,
        },
    };

    const success = await insertEvent(event);

    return success
        ? json({ success: true, id: deliveryId }, { status: 201 })
        : json({ message: "Failed to save event" }, { status: 500 });
}