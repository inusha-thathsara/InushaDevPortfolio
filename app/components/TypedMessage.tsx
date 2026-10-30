import React, { useState, useEffect } from 'react';

interface TypedMessageProps {
    content: string;
    speed?: number; // ms per character
    showCursor?: boolean;
    onComplete?: () => void;
    onUpdate?: () => void;
}

const TypedMessage: React.FC<TypedMessageProps> = ({ content, speed = 15, showCursor = true, onComplete, onUpdate }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        // If content was cleared, reset immediately
        if (!content) {
            setDisplayedText('');
            return;
        }

        // If we already displayed this content (e.g. re-render), don't restart unless content grew
        if (displayedText === content) return;

        // Use a ref-like approach via variable since we are in a hook
        let currentIndex = displayedText.length;
        let isCancelled = false;

        // If content is shorter than what we displayed (shouldn't happen in append-only log but handle it), reset
        if (content.length < displayedText.length) {
            setDisplayedText('');
            currentIndex = 0;
        }

        const typeNextChar = () => {
            if (isCancelled) return;

            if (currentIndex < content.length) {
                // Add chunk of characters to speed up if lagging too much
                // But for smooth typewriter, 1 char at a time is best unless very long
                setDisplayedText(content.slice(0, currentIndex + 1));
                currentIndex++;
                if (onUpdate) onUpdate(); // Trigger scroll or listener
                setTimeout(typeNextChar, speed);
            } else {
                if (onComplete) onComplete();
            }
        };

        // Start typing loop
        typeNextChar();

        return () => {
            isCancelled = true;
        };
    }, [content, speed, onComplete]); // Re-run if target content changes

    const formatText = (text: string) => {
        // Regex to match URLs (simple version for the requested domains)
        // Matches http/https or just domain.com/path
        // FIX: Adjusted greedy match to ensure it doesn't end with a dot
        const urlRegex = /((?:https?:\/\/)?(?:www\.)?(?:github\.com\/[\w-]+|linkedin\.com\/in\/[\w-]+)(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*[-a-zA-Z0-9()@:%_\+~#?&//=])?)/g;

        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                // Ensure proper protocol
                const href = part.startsWith('http') ? part : `https://${part}`;
                return (
                    <a
                        key={index}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline decoration-dotted underline-offset-4 transition-colors"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <span className="whitespace-pre-wrap">
            {formatText(displayedText)}
            {showCursor && (
                <span className="animate-pulse inline-block w-2 h-4 bg-[#10b981] ml-1 align-middle opacity-50"></span>
            )}
        </span>
    );
};

export default TypedMessage;
