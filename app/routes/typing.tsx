// import { PassThrough } from 'stream';
// import type { LoaderFunction } from '@remix-run/node';

// export const loader: LoaderFunction = async () => {
//     const text = "<Project's Deployment showcase={app.active} />";

//     const stream = new PassThrough();

//     const sendCharacters = (
//         stream: PassThrough,
//         text: string,
//         index = 0
//     ): void => {
//         if (index === 0) {
//             // Write opening HTML tags
//             stream.write(
//                 `<!DOCTYPE html><html><head><title>Typing Effect</title></head><body><div id="content">`
//             );
//         }

//         if (index < text.length) {
//             stream.write(text[index]);
//             setTimeout(() => sendCharacters(stream, text, index + 1), 100);
//         } else {
//             // Write closing HTML tags
//             stream.write(`</div></body></html>`);
//             stream.end();
//         }
//     };

//     sendCharacters(stream, text);

//     return new Response(stream as any, {
//         status: 200,
//         headers: {
//             'Content-Type': 'text/html; charset=utf-8',
//             'Transfer-Encoding': 'chunked',
//         },
//     });
// };

// export default function TypingEffect() {

//     return (    
//         <div>
//             <h1>Typing Effect</h1>
//             <div id="content"></div>
//             </div>
//             );
//         }
// app/routes/typing.tsx