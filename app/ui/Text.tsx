import { useEffect, useState } from "react";

interface TextProps {
    text: string;
    speed?: number;
    loop?: boolean;
}

const Text: React.FC<TextProps> = ({ text, speed = 100, loop = true }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let currentIndex = 0;
        let timeoutId: NodeJS.Timeout;

        function type() {
            setDisplayedText(text.slice(0, currentIndex + 1));
            currentIndex++;

            if (currentIndex < text.length) {
                timeoutId = setTimeout(type, speed);
            } else if (loop) {
                setTimeout(() => {
                    currentIndex = 0;
                    setDisplayedText("");
                    type();
                }, 1000);
            }
        }

        type();

        return () => clearTimeout(timeoutId);
    }, [text, speed, loop]);

    return (
        <code className="prose-xl text-3xl md:text-4xl lg:text-6xl text-[#50e5ff] hover:text-[#7ab6ffe5] lg:m-12">
            {displayedText}
        </code>
    );
};

export default Text;
