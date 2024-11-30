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



import { useEffect, useRef, useState } from "react";

interface TypingEffectProps {
    textOption?: string;
    customText?: string;
    speed?: number;
    loop?: boolean;
    className?: string;
    startDelay?: number;
}

export default function TypingEffect({
    textOption = "welcome",
    customText,
    speed = 200,
    loop = true,
    className = "",
    startDelay = 0
}: TypingEffectProps) {
    const [textContent, setTextContent] = useState("");
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const initEventSource = () => {
            const queryParams = new URLSearchParams({
                text: textOption,
                speed: speed.toString()
            });

            if (customText) {
                queryParams.set("custom", customText);
            }

            const url = `/typing-effect-stream?${queryParams.toString()}`;
            eventSourceRef.current = new EventSource(url);

            eventSourceRef.current.onmessage = (event) => {
                setTextContent(event.data);
            };

            eventSourceRef.current.addEventListener('end', () => {
                if (loop) {
                    timeoutId = setTimeout(() => {
                        setTextContent("");
                        eventSourceRef.current?.close();
                        initEventSource(); // Reinitialize for continuous loop
                    }, 2000); // Longer pause between loops
                } else {
                    eventSourceRef.current?.close();
                }
            });

            eventSourceRef.current.onerror = () => {
                eventSourceRef.current?.close();
                if (loop) {
                    timeoutId = setTimeout(initEventSource, 1000);
                }
            };
        };

        const timer = setTimeout(initEventSource, startDelay);

        return () => {
            clearTimeout(timer);
            clearTimeout(timeoutId);
            eventSourceRef.current?.close();
        };
    }, [textOption, customText, speed, loop, startDelay]);

    return (
        <div className={`typing-effect-container ${className}`}>
            <div className="relative font-mono">
                <code className="text-inherit transition-colors duration-300">
                    {textContent}
                </code>
                <span className="typing-cursor animate-blink">|</span>
            </div>
        </div>
    );
}