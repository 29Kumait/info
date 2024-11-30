// app/components/Ripple.tsx
import React from "react";

interface RippleProps {
    numRipples?: number;
    rippleSize?: number;
    rippleSpacing?: number;
    animationDuration?: number;
    rippleColor?: string;
    className?: string;
}

const Ripple: React.FC<RippleProps> = ({
    numRipples = 5,
    rippleSize = 200,
    rippleSpacing = 60,
    animationDuration = 4,
    rippleColor = "rgba(255, 255, 255, 0.5)",
    className = "",
}) => {
    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {Array.from({ length: numRipples }).map((_, i) => {
                const size = rippleSize + i * rippleSpacing;
                const delay = i * (animationDuration / numRipples);

                return (
                    <div
                        key={i}
                        className="absolute rounded-full border animate-rippleExpand"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            borderColor: rippleColor,
                            borderWidth: "1px",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            animationDelay: `${delay}s`,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Ripple;
