// AnimatedCard.tsx
import { FC } from "react";
import { useInView } from "react-intersection-observer";
import MDXWrapper from "~/ui/MDXWrapper";

interface Card {
    slug: string;
    title: string;
}

interface AnimatedCardProps {
    card: Card;
    index: number;
    mdxFiles: Record<string, FC>;
}

const AnimatedCard: FC<AnimatedCardProps> = ({ card, index, mdxFiles }) => {
    const hydrated = useHydrated();

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        skip: !hydrated,
        initialInView: false,
    });

    const Component = mdxFiles[card.slug];

    let animationClass = "";
    if (inView) {
        if (index % 3 === 0) {
            animationClass = "animate-slide-in-left";
        } else if (index % 3 === 1) {
            animationClass = "animate-slide-in-bottom";
        } else {
            animationClass = "animate-slide-in-right";
        }
    }

    return (
        <div
            ref={ref}
            className={`animated-border p-6 w-full border border-gray-200 bg-white rounded-xl shadow-md transition-all duration-500 ease-in-out ${animationClass}`}
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text-opacity-90">
                {card.title}
            </h2>
            <div className="max-h-48 overflow-y-auto hidden-scrollbar">
                <MDXWrapper Component={Component} />
            </div>
        </div>
    );
};

export default AnimatedCard;

// useHydrated.ts
import { useState, useEffect } from "react";

 function useHydrated() {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);
    return hydrated;
}
