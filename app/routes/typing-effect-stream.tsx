// // app/routes/typing-effect-stream.tsx
// import { LoaderFunction } from "@remix-run/node";

// import { PassThrough } from "node:stream";
// import { createReadableStreamFromReadable } from "@remix-run/node";
// export const loader: LoaderFunction = async ({ request }) => {
//     const text = "<Project's Deployment showcase={app.active} />";
//     const speed = 100;

//     const stream = new PassThrough();

//     // Set headers for SSE
//     const headers = new Headers({
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache, no-transform",
//         Connection: "keep-alive",
//     });

//     const encoder = new TextEncoder();

//     async function typeText() {
//         let content = "";
//         for (let i = 0; i < text.length; i++) {
//             content += text[i];
//             const data = `data: ${content}\n\n`;
//             stream.write(encoder.encode(data));
//             await new Promise((resolve) => setTimeout(resolve, speed));
//         }
//         stream.end();
//     }

//     typeText();

//     const body = createReadableStreamFromReadable(stream);

//     return new Response(body, {
//         status: 200,
//         headers,
//     });
// };
