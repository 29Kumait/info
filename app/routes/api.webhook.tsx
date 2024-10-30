// app/routes/api.webhook.tsx
import type {ActionFunction} from "@remix-run/node";
import {processWebhook} from "~/db/webhook.server";
import {Outlet} from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
    return processWebhook(request);
};

export default function WebhookRoute() {
    return <Outlet/>
}
