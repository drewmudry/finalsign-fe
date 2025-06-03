"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  getUppercaseSVG,
  getLowercaseSVG,
  applyLetterMargins,
} from "./helpers";

interface SignatureInputProps {
  placeholder?: string;
  onSignatureComplete?: (name: string) => void;
  className?: string;
  autoType?: string;
  autoTypeDelay?: number;
  // Animation props
  enableAnimation?: boolean;
  animationSpeed?: "slow" | "normal" | "fast";
  // Color props
  colorScheme?: "default" | "gradient" | "custom";
  customColors?: {
    background?: string;
    border?: string;
    text?: string;
    stroke?: string;
    placeholder?: string;
    borderActive?: string;
    signedBy?: string;
  };
  // Layout props
  preventLayoutShift?: boolean;
  fixedHeight?: boolean;
  maxWidth?: string | number;
  strokeWidth?: number;
}

export function SignatureInput({
  placeholder = "Your name",
  onSignatureComplete,
  className = "",
  autoType,
  autoTypeDelay = 0,
  enableAnimation = true,
  animationSpeed = "normal",
  colorScheme = "default",
  customColors,
  preventLayoutShift = false,
  fixedHeight = false,
  maxWidth,
  strokeWidth = 1,
}: SignatureInputProps) {
  const [isActive, setIsActive] = useState(preventLayoutShift);
  const [inputValue, setInputValue] = useState("");
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  // Animation speed settings
  const getAnimationSpeed = () => {
    switch (animationSpeed) {
      case "slow":
        return { typing: 120, stroke: 800 };
      case "fast":
        return { typing: 50, stroke: 200 };
      default:
        return { typing: 80, stroke: 400 };
    }
  };

  // Color scheme settings
  const getColors = () => {
    if (customColors) return customColors;

    switch (colorScheme) {
      case "gradient":
        return {
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 100%)",
          border: "rgba(59,130,246,0.2)",
          borderActive: "rgba(59,130,246,0.6)", // Already defined
          text: "#1f2937",
          stroke: "url(#signature-gradient)",
          placeholder: "rgba(59,130,246,0.6)",
          signedBy: "rgba(59,130,246,0.7)",
        };
      case "default":
      default:
        return {
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)",
          border: "rgba(0,0,0,0.05)",
          borderActive: "rgba(0,0,0,0.5)", // Add this line that was missing
          text: "#000",
          stroke: "#000",
          placeholder: "rgba(0,0,0,0.5)",
          signedBy: "rgba(0,0,0,0.5)",
        };
    }
  };

  const colors = getColors();
  const speeds = getAnimationSpeed();

  // Auto-typing effect
  useEffect(() => {
    if (!autoType) return;

    const startAutoType = () => {
      setIsAutoTyping(true);
      let currentIndex = 0;

      const typeNextCharacter = () => {
        if (currentIndex < autoType.length) {
          const newValue = autoType.slice(0, currentIndex + 1);

          setInputValue(newValue);
          if (!preventLayoutShift) {
            setIsActive(true);
          }

          // Update the input field value
          if (nameInputRef.current) {
            nameInputRef.current.value = newValue;
          }

          // Redraw signature with animation for the new character
          if (signatureRef.current) {
            signatureRef.current.innerHTML = "";
            const letters = newValue.split("");
            letters.forEach((letter, index) => {
              const isLastLetter = index === letters.length - 1;
              draw(letter, enableAnimation && isLastLetter);
            });
          }

          currentIndex++;

          // Use animation speed setting
          const delay = Math.random() * (speeds.typing * 0.7) + speeds.typing;
          setTimeout(typeNextCharacter, delay);
        } else {
          setIsAutoTyping(false);
          if (onSignatureComplete) {
            onSignatureComplete(autoType);
          }
        }
      };

      setTimeout(typeNextCharacter, autoTypeDelay);
    };

    startAutoType();
  }, [
    autoType,
    autoTypeDelay,
    onSignatureComplete,
    enableAnimation,
    speeds.typing,
    preventLayoutShift,
  ]);

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (isAutoTyping) return;

    const value = (event.target as HTMLInputElement).value;
    setInputValue(value);
    if (!preventLayoutShift) {
      setIsActive(!!value);
    }

    if (signatureRef.current) {
      signatureRef.current.innerHTML = "";
      const letters = value.split("");
      letters.forEach((letter) => {
        draw(letter, false);
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isAutoTyping) return;

    if (
      event.code === `Key${event.key.toUpperCase()}` ||
      event.code === "Space"
    ) {
      setTimeout(() => {
        if (signatureRef.current) {
          const currentValue = nameInputRef.current?.value || "";
          signatureRef.current.innerHTML = "";
          const letters = currentValue.split("");

          letters.forEach((letter, index) => {
            const isLastLetter = index === letters.length - 1;
            draw(letter, enableAnimation && isLastLetter);
          });
        }
      }, 10);
    }
  };

  const draw = (key: string, animate: boolean) => {
    if (!signatureRef.current) return;

    if (key === " ") {
      const space = document.createElement("div");
      space.style.minWidth = "12px";
      signatureRef.current.appendChild(space);
    } else {
      const alphabet = Array.from({ length: 26 }, (_, i) =>
        String.fromCharCode(97 + i)
      );

      for (let i = 0; i < alphabet.length; i++) {
        const item = alphabet[i];

        if (key.toLowerCase() === item) {
          const letter = document.createElement("div");
          const isUppercase = key === item.toUpperCase();

          if (isUppercase) {
            letter.innerHTML = getUppercaseSVG(item);
            letter.classList.add("up");
          } else {
            letter.innerHTML = getLowercaseSVG(item);
            letter.classList.add("lo");
          }

          letter.classList.add(item);
          letter.style.maxHeight = "51px";

          applyLetterMargins(letter, item, isUppercase);

          const path = letter.querySelector("svg path") as SVGPathElement;
          if (path) {
            const pathLength = path.getTotalLength();
            path.style.strokeDasharray = pathLength.toString();

            if (animate && enableAnimation) {
              path.style.strokeDashoffset = pathLength.toString();
              setTimeout(() => {
                path.style.strokeDashoffset = "0";
              }, 50);
            } else {
              path.style.strokeDashoffset = "0";
            }
          }

          signatureRef.current.appendChild(letter);
          break;
        }
      }
    }
  };

  // Your existing helper functions (getUppercaseSVG, getLowercaseSVG, applyLetterMargins)

  return (
    <>
      {/* Gradient definition for stroke when using gradient color scheme */}
      {(colorScheme === "gradient" ||
        (colorScheme === "custom" &&
          colors.stroke === "url(#signature-gradient)")) && (
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", top: "-9999px" }}
        >
          <defs>
            <linearGradient
              id="signature-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#1d503a" />
              <stop offset="100%" stopColor="#1d503a" />
            </linearGradient>
          </defs>
        </svg>
      )}

      <div
        className={`signature-modal ${isActive ? "active" : ""} ${className}`}
      >
        <div className="field-wrapper">
          <input
            ref={nameInputRef}
            autoComplete="off"
            className="field"
            maxLength={256}
            placeholder={placeholder}
            type="text"
            required
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={inputValue}
            readOnly={isAutoTyping}
          />
        </div>

        {(isActive || preventLayoutShift) && (
          <div
            className={`signature ${
              !isActive && preventLayoutShift ? "hidden" : ""
            }`}
          >
            <div className="signature-main" ref={signatureRef}></div>
            <div className="signed-by">Signed by, {inputValue}</div>
          </div>
        )}

        <style jsx>{`
          .signature-modal {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 36px;
            width: 420px;
            max-width: ${maxWidth
              ? typeof maxWidth === "number"
                ? `${maxWidth}px`
                : maxWidth
              : "none"};
            height: ${fixedHeight
              ? "220px"
              : isActive || preventLayoutShift
              ? "220px"
              : "60px"};
            padding: ${isActive || preventLayoutShift ? "32px" : "24px"};
            border-radius: ${isActive || preventLayoutShift ? "48px" : "40px"};
            overflow: visible;
            background: ${colors.background};
            box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0);
            transition: ${preventLayoutShift || fixedHeight
              ? "none"
              : "0.4s ease height, 0.4s ease padding, 0.2s border-radius, 0.6s ease box-shadow"};
          }

          .signature-modal:hover {
            box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.025);
          }

          .field-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }

          .field {
            font-family: "Inter", sans-serif;
            font-size: 20px;
            display: flex;
            align-items: center;
            min-height: 48px;
            border-radius: 16px;
            border: 1px solid ${colors.border};
            padding: 0 12px 2px 12px;
            background: none;
            color: ${colors.text};
            outline: none;
            transition: border 0.2s;
          }

          .signature-modal.active .field {
            border: 1px solid ${colors.borderActive || colors.border};
          }

          .field::placeholder {
            opacity: 0.8;
            color: ${colors.placeholder || colors.text};
          }

          .field[readonly] {
            cursor: default;
          }

          .signature {
            border-bottom: 1px solid
              ${colors.borderActive || colors.border || "rgba(0,0,0,0.25)"};
            padding-top: 10px;
          }

          .signature.hidden {
            opacity: 0;
            pointer-events: none;
          }

          .signed-by {
            color: ${colors.signedBy};
            opacity: 1;
            padding-bottom: 2px;
            transition: 0.2s ease;
            font-family: "JetBrains Mono", monospace;
            font-size: 14px;
            letter-spacing: 0.02em;
            text-transform: uppercase;
          }

          .signature-main {
            display: flex;
            min-height: 80px;
            flex-flow: wrap;
            justify-content: start;
            padding-bottom: 10px;
          }

          .signature-main :global(svg path) {
            stroke-linejoin: round;
            stroke-linecap: round;
            stroke-width: ${strokeWidth};
            stroke: ${colors.stroke};
            fill: none;
            transition: ${speeds.stroke}ms ease stroke-dashoffset;
          }

          .signature-main :global(.up),
          .signature-main :global(.lo) {
            max-height: 51px;
          }
        `}</style>
      </div>
    </>
  );
}
