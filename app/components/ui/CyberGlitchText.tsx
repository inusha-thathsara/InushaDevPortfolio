"use client";

import React, { useState, useEffect, useRef } from "react";
import { sound } from "@/app/lib/audio";

interface CyberGlitchTextProps {
  text: string;
  className?: string;
  glitchOnHover?: boolean;
  speed?: number;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
}

const CYBER_CHARS = "01アイウエオカキクケコサシスセソ0123456789!<>-_\\/[]{}—=+*^?#________";

export default function CyberGlitchText({
  text,
  className = "",
  glitchOnHover = true,
  speed = 30,
  as: Component = "span",
}: CyberGlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScrambling = useRef(false);

  const scramble = () => {
    if (isScrambling.current) return;
    isScrambling.current = true;
    sound.playClick(1400);

    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        isScrambling.current = false;
      }

      iteration += 1 / 2;
    }, speed);
  };

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  return (
    <Component
      onMouseEnter={glitchOnHover ? scramble : undefined}
      className={`inline-block cursor-default transition-colors ${className}`}
    >
      {displayText}
    </Component>
  );
}
