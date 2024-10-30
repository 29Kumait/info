// app/routes/api/webhook.ts
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import crypto from "crypto";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, { status: 405 });
  }

  const signature = request.headers.get("X-Hub-Signature-256");
  const deliveryId = request.headers.get("X-GitHub-Delivery");
  const eventType = request.headers.get("X-GitHub-Event") || "unknown_event";

  if (!signature || !deliveryId) {
    return json({ message: "Missing required headers" }, { status: 400 });
  }

  const secret = process.env.WEBHOOK_SECRET || "";
  if (!secret) {
    console.error("WEBHOOK_SECRET is not set");
    return json({ message: "Server error" }, { status: 500 });
  }

  const payload = await request.text();

  // Validate the signature
  const hmac = crypto.createHmac("sha256", secret);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    return json({ message: "Signature mismatch" }, { status: 401 });
  }

  // Store the event in MongoDB
  try {
    const eventsCollection = db.collection("events");
    await eventsCollection.insertOne({
      _id: deliveryId,
      eventType,
      payload,
      receivedAt: new Date(),
    });
    return json({ id: deliveryId }, { status: 201 });
  } catch (error) {
    console.error("Error saving event:", error);
    return json({ message: "Failed to save event" }, { status: 500 });
  }
};