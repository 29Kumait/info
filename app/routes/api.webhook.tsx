import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { insertEvent } from "../db/eventStorage.server.ts";

export const action = async ({ request }: ActionFunctionArgs) => {
    // Handle GET requests with a basic message or redirection
    if (request.method === "GET") {
        return json({ message: "Webhook endpoint: please use POST method" }, 400);
    }

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
