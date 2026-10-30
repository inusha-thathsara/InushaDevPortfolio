"use client";

import React from "react";
import { useSystem } from "../../context/SystemContext";

interface GlitchWrapperProps {
    children: React.ReactNode;
}

const GlitchWrapper = ({ children }: GlitchWrapperProps) => {
    const { isCritical } = useSystem();

    return (
        <div id="glitch-wrapper" className={isCritical ? "glitch-active pointer-events-none" : ""}>
            {children}
        </div>
    );
};

export default GlitchWrapper;
