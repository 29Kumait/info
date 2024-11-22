import { useState } from 'react';
import buttonUrl from '../styles/Button.css?url';
import {LinksFunction} from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: buttonUrl },
];

interface ButtonProps {
  code: string;
  buttonText?: string;
  copiedText?: string;
  className?: string;
}

export default function Button({
  code,
  buttonText = 'Copy',
  copiedText = 'Copied!',
  className = 'copy-button',
}: ButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    });
  };

  return (
    <button onClick={handleCopy} className="copy-button">
      {copied ? copiedText : buttonText}
    </button>
  );
}