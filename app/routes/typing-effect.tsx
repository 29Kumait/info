// import { useEffect, useRef, useState } from "react";

// export default function TypingEffect() {
//     const [textContent, setTextContent] = useState("");
//     const containerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         console.log("Connecting to EventSource");

//         const eventSource = new EventSource("/typing-effect-stream");

//         eventSource.onmessage = (event) => {
//             console.log("Received message:", event.data);

//             setTextContent(event.data);
//         };

//         return () => {
//             eventSource.close();
//         };
//     }, []);

//     return (
//         <div className="rounded-xl m-32">
//             <div ref={containerRef} suppressHydrationWarning={true}>
//                 <code>{textContent}</code>
//             </div>
//         </div>
//     );
// }
