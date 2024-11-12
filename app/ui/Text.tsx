import { useEffect, useState } from 'react';

interface TextProps {
    text: string;
    speed?: number;
}

const Text: React.FC<TextProps> = ({ text, speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        let currentText = '';

        const typingInterval = setInterval(() => {
            currentText += text.charAt(index);
            setDisplayedText(currentText);
            index++;

            if (index >= text.length) {
                clearInterval(typingInterval);
            }
        }, speed);

        return () => clearInterval(typingInterval);
    }, [text, speed]);

    return <code className="prose-2xl  text-5xl md:text-6xl lg:text-7xl text-blue-100 lg:m-12 mt-24 bg-cover bg-no-repeat bg-blend-multiply bg-clip-text"> {displayedText}</code>;
};

export default Text;