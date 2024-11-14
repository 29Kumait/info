import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/foundation.min.css';

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
        <code ref={codeRef} className={`language-${language}`}>{code}</code>
    );
}