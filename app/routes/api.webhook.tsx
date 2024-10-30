// app/routes/api/webhook.tsx
import { ActionFunctionArgs, json } from "@remix-run/node";
import { insertEvent } from "../db/eventStorage.server.ts";

const webhookSecret = process.env.WEBHOOK_SECRET;

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    const payload = await request.text();
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery");

    const secretHeader = request.headers.get("X-Hub-Signature-256");

    if (!webhookSecret) {
        throw new Error("WEBHOOK_SECRET environment variable is not set.");
    }

    if (!secretHeader || secretHeader !== webhookSecret) {
        return json({ message: "Unauthorized request" }, 401);
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
