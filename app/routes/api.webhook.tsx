import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { insertEvent } from "../db/eventStorage.server.ts";
import process from "node:process";

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    const payload = await request.text();
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery");

    // Check for the webhook secret in environment variables
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const secretHeader = request.headers.get("X-Hub-Signature-256");

    if (!webhookSecret) {
        throw new Error("GITHUB_WEBHOOK_SECRET environment variable is not set.");
    }

    // Basic secret verification
    if (!secretHeader || secretHeader !== webhookSecret) {
        return json({ message: "Unauthorized request" }, 401);
    }

    // Store the event in MongoDB
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
