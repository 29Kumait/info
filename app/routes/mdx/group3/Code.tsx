import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night-blue.css';

interface CodeProps {
    code: string;
    language: string;
}

export function Code({ code, language }: CodeProps) {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current);
        }
    }, [code]);

    return (
        <pre className="bg-black p-6 rounded-lg text-gray-100 shadow-xl overflow-auto border border-gray-700">
            <code ref={ codeRef } className={ `language-${ language }` }>
                { code }
            </code>
        </pre>
    );
}
