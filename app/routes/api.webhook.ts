import { ActionFunctionArgs } from "@remix-run/node";
import { insertEvent } from "~/db/eventStorage.server";
import { sanitizeEventData } from "~/utils/sanitizeData";
import type { Event } from "~/types/type";

export const loader = async () => {
    return Response.json({ message: "Method not allowed" }, { status: 405 });
};

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return Response.json({ message: "Method not allowed" }, { status: 405 });
    }
    const crypto = await import("crypto");
    const deliveryId = request.headers.get("X-GitHub-Delivery");
    const eventType = request.headers.get("X-GitHub-Event");
    if (!deliveryId || !eventType) {
        return Response.json({ message: "Invalid headers" }, { status: 400 });
    }

    const payload = await request.json();

    const signature = request.headers.get("X-Hub-Signature-256");
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error("WEBHOOK_SECRET is not defined");
    }
    const generatedSignature = `sha256=${crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(payload))
        .digest("hex")}`;
    if (signature !== generatedSignature) {
        return Response.json({ message: "Signature mismatch" }, { status: 401 });
    }

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
        ? Response.json({ success: true }, { status: 200 })
        : Response.json({ message: "Failed to save event" }, { status: 500 });
}