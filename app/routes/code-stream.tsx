import { LoaderFunction, createReadableStreamFromReadable } from "@remix-run/node";
import { PassThrough } from "stream";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const codeSnippet = decodeURIComponent(url.searchParams.get("code") || "");
    const language = url.searchParams.get("language") || "typescript";
    const speed = Number(url.searchParams.get("speed")) || 50;

    const stream = new PassThrough();
    let i = 0;

    const interval = setInterval(() => {
        if (i < codeSnippet.length) {
            const content = codeSnippet.slice(0, i + 1);
            stream.write(`data: ${JSON.stringify({ content, language })}\n\n`);
            i++;
        } else {
            clearInterval(interval);
            stream.end();
        }
    }, speed);

    const body = createReadableStreamFromReadable(stream);

    return new Response(body, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    });
};
