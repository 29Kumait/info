// app/components/RippleBackground.tsx
import React from "react";
import Ripple from "./Ripple";

interface RippleBackgroundProps {
    textOverlay?: string;
    overlayClassName?: string;
    rippleProps?: React.ComponentProps<typeof Ripple>;
}

const RippleBackground: React.FC<RippleBackgroundProps> = ({
    textOverlay = "Ripple Effect",
    overlayClassName = "",
    rippleProps = {},
}) => {
    return (
        <div className="relative w-full h-screen bg-customGray overflow-hidden flex items-center justify-center">
            <Ripple {...rippleProps} />
            <div
                className={`absolute z-10 text-center text-white text-4xl font-bold ${overlayClassName}`}
            >
                {textOverlay}
            </div>
        </div>
    );
};

export default RippleBackground;
