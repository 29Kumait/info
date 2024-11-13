// import { useEffect, useRef } from "react";

// export default function TypingEffect() {
//     const containerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const eventSource = new EventSource("/typing-effect-stream");

//         eventSource.onmessage = (event) => {
//             if (containerRef.current) {
//                 containerRef.current.innerHTML = `<code>${event.data}</code>`;
//             }
//         };

//         return () => {
//             eventSource.close();
//         };
//     }, []);

//     return (
//         <div className="rounded-xl m-32">
//             <div ref={containerRef} suppressHydrationWarning={true}></div>
//         </div>
//     );
// }



// // // app/routes/typing-effect.tsx

// // export default function TypingEffect() {
// //     const text = "<Project's Deployment showcase={app.active} />";
  
// //     return (
// //       <div className="rounded-xl m-32">
// //         <code className="typing-effect">{text}</code>
// //       </div>
// //     );
// //   }
  