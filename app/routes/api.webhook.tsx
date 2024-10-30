    import {ActionFunction , json} from "@remix-run/node";
import crypto from "crypto";
import {insertEvent} from "~/db/eventStorage.server";

export const action: ActionFunction = async ({ request }) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    const payload = await request.text();
    const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";
    const deliveryId = request.headers.get("X-GitHub-Delivery");

    const signature = request.headers.get("X-Hub-Signature-256");
    const generatedSignature = `sha256=${crypto
        .createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET as string)
        .update(payload)
        .digest("hex")}`;

    if (signature !== generatedSignature) {
        return json({ message: "Signature mismatch" }, 401);
    }

    const event = { id: deliveryId as string, eventType, payload };
    const success = await insertEvent(event);

    if (!success) {
        return json({ message: "Failed to save event" }, 500);
    }

    return json({ success: true, id: deliveryId }, 201);
};
nnnn