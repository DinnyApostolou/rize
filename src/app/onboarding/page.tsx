"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const positions = ["PG", "SG", "SF", "PF", "C", "Not sure yet"];

const skillLevels = [
  { value: "beginner", label: "Beginner", description: "Just starting out" },
  { value: "intermediate", label: "Intermediate", description: "Been playing 1-3 years" },
  { value: "advanced", label: "Advanced", description: "Serious player / competitive" },
];

const goals = [
  { value: "handles", label: "Improve my handles" },
  { value: "shooting", label: "Sharpen my shooting" },
  { value: "strength", label: "Build explosive strength" },
  { value: "full", label: "Full athlete development" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [position, setPosition] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [goal, setGoal] = useState("");

  const totalSteps = 3;
  const progressPercent = (step / totalSteps) * 100;

  function canContinue() {
    if (step === 1) return position !== "";
    if (step === 2) return skillLevel !== "";
    if (step === 3) return goal !== "";
    return false;
  }

  function handleContinue() {
    if (!canContinue()) return;
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      localStorage.setItem("rize_position", position);
      localStorage.setItem("rize_skill_level", skillLevel);
      localStorage.setItem("rize_goal", goal);
      localStorage.setItem("rize_onboarded", "true");
      router.push("/dashboard");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "3px",
          backgroundColor: "var(--border)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "var(--accent)",
            width: `${progressPercent}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 32px",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--accent)",
            letterSpacing: "-0.5px",
          }}
        >
          RZ.
        </span>
        <span
          style={{
            fontSize: "13px",
            color: "var(--text2)",
            fontWeight: 500,
          }}
        >
          Step {step} of {totalSteps}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px 48px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "480px" }}>
          {step === 1 && (
            <StepOne
              position={position}
              onSelect={(val) => {
                setPosition(val);
              }}
            />
          )}
          {step === 2 && (
            <StepTwo
              skillLevel={skillLevel}
              onSelect={(val) => {
                setSkillLevel(val);
              }}
            />
          )}
          {step === 3 && (
            <StepThree
              goal={goal}
              onSelect={(val) => {
                setGoal(val);
              }}
            />
          )}

          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            style={{
              marginTop: "32px",
              width: "100%",
              padding: "14px 24px",
              borderRadius: "10px",
              border: "none",
              fontSize: "15px",
              fontWeight: 600,
              cursor: canContinue() ? "pointer" : "not-allowed",
              backgroundColor: canContinue() ? "var(--accent)" : "var(--bg3)",
              color: canContinue() ? "#ffffff" : "var(--text2)",
              transition: "background-color 0.2s ease, color 0.2s ease",
              letterSpacing: "0.01em",
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

function StepOne({
  position,
  onSelect,
}: {
  position: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "12px",
        }}
      >
        Welcome to Rize
      </p>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: "32px",
          color: "var(--text)",
          letterSpacing: "-0.5px",
        }}
      >
        What position do you play?
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
        }}
      >
        {positions.slice(0, 5).map((pos) => (
          <OptionCard
            key={pos}
            label={pos}
            selected={position === pos}
            onClick={() => onSelect(pos)}
          />
        ))}
        <div style={{ gridColumn: "1 / -1" }}>
          <OptionCard
            label="Not sure yet"
            selected={position === "Not sure yet"}
            onClick={() => onSelect("Not sure yet")}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}

function StepTwo({
  skillLevel,
  onSelect,
}: {
  skillLevel: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: "32px",
          color: "var(--text)",
          letterSpacing: "-0.5px",
        }}
      >
        What's your skill level?
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {skillLevels.map((item) => (
          <button
            key={item.value}
            onClick={() => onSelect(item.value)}
            style={{
              padding: "16px 20px",
              borderRadius: "10px",
              border: `1px solid ${skillLevel === item.value ? "var(--accent)" : "var(--border)"}`,
              backgroundColor:
                skillLevel === item.value ? "rgba(14, 165, 233, 0.08)" : "var(--bg2)",
              color: "var(--text)",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              transition: "border-color 0.15s ease, background-color 0.15s ease",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: 600 }}>{item.label}</span>
            <span style={{ fontSize: "13px", color: "var(--text2)" }}>
              {item.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepThree({
  goal,
  onSelect,
}: {
  goal: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: "32px",
          color: "var(--text)",
          letterSpacing: "-0.5px",
        }}
      >
        What's your main goal?
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {goals.map((item) => (
          <button
            key={item.value}
            onClick={() => onSelect(item.value)}
            style={{
              padding: "16px 20px",
              borderRadius: "10px",
              border: `1px solid ${goal === item.value ? "var(--accent)" : "var(--border)"}`,
              backgroundColor:
                goal === item.value ? "rgba(14, 165, 233, 0.08)" : "var(--bg2)",
              color: "var(--text)",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "15px",
              fontWeight: 600,
              transition: "border-color 0.15s ease, background-color 0.15s ease",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function OptionCard({
  label,
  selected,
  onClick,
  fullWidth,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "14px 12px",
        borderRadius: "10px",
        border: `1px solid ${selected ? "var(--accent)" : "var(--border)"}`,
        backgroundColor: selected ? "rgba(14, 165, 233, 0.08)" : "var(--bg2)",
        color: selected ? "var(--accent2)" : "var(--text)",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "14px",
        width: fullWidth ? "100%" : "auto",
        textAlign: "center",
        transition: "border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}
