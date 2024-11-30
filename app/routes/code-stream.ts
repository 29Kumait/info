import { LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions.server';

export const loader: LoaderFunction = async ({ request }) => {
    const codeSnippet = `console.log('Resume!');\nfunction name(Kumait: devloper) {\n  return 'WebPage, ' + style;\n}\n
        language: 'typescript',\n 
         ..// FullStack - Mode Toggle\n
       .CSS { Lightning Tailwind StyleX CSS !important;}

       const me: FullStackDev = {
         frontend: 'React | Remix | Next';
backend: 'Node | Express | API';
  database: 'SQL | NoSQL';
    return We;
};\n
const remixRunner = new Developer('Starting the Portfolio', '...Loading skills');
adventure.code(); // Output: "right now..."
`;

    const session = await getSession(request.headers.get('Cookie'));

    session.set('codeSnippet', codeSnippet);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            let index = 0;

            function pushChunk() {
                if (index < codeSnippet.length) {
                    const chunk = codeSnippet[index++];
                    const eventData = `data: ${encodeURIComponent(chunk)}\n\n`;
                    controller.enqueue(encoder.encode(eventData));
                    setTimeout(pushChunk, 50);
                } else {
                    controller.close();
                }
            }

            pushChunk();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'Set-Cookie': await commitSession(session),
        },
    });
};
