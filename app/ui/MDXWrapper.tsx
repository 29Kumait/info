import { FC } from "react";
import { useInView } from "react-intersection-observer";

interface MDXWrapperProps {
    Component: FC;
    className?: string;
}

const MDXWrapper: FC<MDXWrapperProps> = ({ Component, className }) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <div
            ref={ref}
            className={`${className || ""} ${inView ? "fade-in scroll-hint" : ""}`}
        >
            <Component />
        </div>
    );
};

export default MDXWrapper;