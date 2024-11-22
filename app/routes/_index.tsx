import React from "react";
import RippleBackground from "~/ui/RippleBackground";

const Index: React.FC = () => {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <RippleBackground
            textOverlay="TEXT"
            rippleProps={{
              numRipples: 7,
              rippleSize: 250,
              rippleSpacing: 50,
              animationDuration: 6,
              rippleColor: "rgba(255, 255, 255, 0.4)",
            }}
        />
      </div>
  );
};

export default Index;