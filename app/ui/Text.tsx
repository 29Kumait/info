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
        <code className="prose-xl text-4xl md:text-5xl lg:text-7xl text-blue-100 lg:m-12 mt-24 bg-cover bg-no-repeat bg-blend-multiply bg-clip-text">
            {displayedText}
        </code>
    );
};

export default Text;
