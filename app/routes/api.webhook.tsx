import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import crypto from "crypto";
import { insertEvent } from "../db/eventStorage.server.ts"; // Adjust if path differs
import process from "node:process";

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    const payload = await request.text();
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery");

    // Validate webhook signature
    const signature = request.headers.get("X-Hub-Signature-256");
    const generatedSignature = `sha256=${crypto
        .createHmac("sha256", process.env.WEBHOOK_SECRET || "")
        .update(payload)
        .digest("hex")}`;

    if (signature !== generatedSignature) {
        return json({ message: "Signature mismatch" }, 401);
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
