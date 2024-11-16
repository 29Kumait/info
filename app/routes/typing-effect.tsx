import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";

interface CodePreviewerProps {
    code: string;
    language?: string;
    speed?: number;
}

function CodePreviewer({ code, language = "typescript", speed = 50 }: CodePreviewerProps) {
    const [typedCode, setTypedCode] = useState("");
    const [copied, setCopied] = useState(false);
    const codeRef = useRef<HTMLElement | null>(null);
    const [dynamicClassName, setDynamicClassName] = useState("");

    useEffect(() => {
        let currentCode = "";
        let index = 0;

        const interval = setInterval(() => {
            if (index < code.length) {
                currentCode += code[index];
                setTypedCode(currentCode);
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [code, speed]);

    useEffect(() => {
        if (codeRef.current) {
            setDynamicClassName(`language-${language}`);
            Prism.highlightElement(codeRef.current);
        }
    }, [typedCode, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="relative bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 custom-ease"

            >
                {copied ? "Copied!" : "Copy"}
            </button>
            <pre className="text-sm leading-6">
                <code
                    ref={codeRef}
                    suppressHydrationWarning={true}
                    className={dynamicClassName || ""}
                >
                    {typedCode}
                </code>
            </pre>
        </div>
    );
}



export default function CodePreviewPage() {
    const codeSnippet = `
  import React from 'react';

  function App() {
    return (
      <div className="App">
        <h1>Hello World!</h1>
      </div>
    );
  }

  export default App;
  `;

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="max-w-4xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Code Previewer</h1>
                <CodePreviewer code={codeSnippet} language="typescript" speed={50} />
            </div>
        </div>
    );
}
