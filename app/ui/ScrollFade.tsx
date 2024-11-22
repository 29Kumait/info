// ScrollFade.tsx
import React, { useRef, useEffect } from 'react';

interface ScrollFadeProps {
    children: React.ReactNode;
    threshold?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}

const fadeInClasses: Record<string, string> = {
    up: 'animate-fade-in-up',
    down: 'animate-fade-in-down',
    left: 'animate-fade-in-left',
    right: 'animate-fade-in-right',
};

const fadeOutClasses: Record<string, string> = {
    up: 'animate-fade-out-up',
    down: 'animate-fade-out-down',
    left: 'animate-fade-out-left',
    right: 'animate-fade-out-right',
};

const ScrollFade: React.FC<ScrollFadeProps> = ({
    children,
    threshold = 0.1,
    duration = 700,
    direction = 'up',
}) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const fadeInClass = fadeInClasses[direction];
        const fadeOutClass = fadeOutClasses[direction];

        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    element.classList.add(fadeInClass);
                    element.classList.remove(fadeOutClass);
                } else {
                    element.classList.remove(fadeInClass);
                    element.classList.add(fadeOutClass);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, { threshold });
        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, direction]);

    const style = {
        '--animation-duration': `${duration}ms`,
    } as React.CSSProperties;

    const initialClass = `opacity-0 ${fadeOutClasses[direction]}`;

    return (
        <div ref={ref} className={initialClass} style={style}>
            {children}
        </div>
    );
};

export default ScrollFade;
