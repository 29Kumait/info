import {ActionFunctionArgs , json} from "@remix-run/node";
import {insertEvent} from "~/db/eventStorage.server";
import {sanitizeEventData} from "~/utils/sanitizeData";
import type {Event} from "~/types/type";

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    const crypto = await import("crypto");
    const payloadText = await request.text(); // Fetch raw payload text for signature generation
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery") || "unknown";

    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("WEBHOOK_SECRET is not set.");
        throw new Response("WEBHOOK_SECRET environment variable is not set.", {
            status: 500,
        });
    }

    const signature = request.headers.get("X-Hub-Signature-256");

    // Generate HMAC signature based on payloadText and webhookSecret
    const generatedSignature = `sha256=${crypto
        .createHmac("sha256", webhookSecret)
        .update(payloadText, "utf-8") // Ensure utf-8 encoding
        .digest("hex")}`;

    // Logging for debugging
    console.log("Generated Signature:", generatedSignature);
    console.log("Received Signature:", signature);

    if (signature !== generatedSignature) {
        console.error("Signature mismatch");
        return json({ message: "Signature mismatch" }, 401);
    }

    // Parse the payload as JSON after signature validation
    const payload = JSON.parse(payloadText);
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
        ? json({ success: true }, 200)
        : json({ message: "Failed to save event" }, 500);
};
