"use client";
import { useState } from "react";
import Link from "next/link";

const MEALS = {
  "Pre-Game": [
    { name: "Oats + Banana + Honey", time: "2-3 hrs before", macros: "65g carbs · 8g protein · 3g fat", why: "Slow-release carbs for sustained energy. No crashes mid-game.", ingredients: ["1 cup rolled oats", "1 banana", "1 tbsp honey", "Pinch of salt"] },
    { name: "Chicken & White Rice", time: "3 hrs before", macros: "70g carbs · 35g protein · 5g fat", why: "Classic athlete pre-game meal. Easy to digest, high energy.", ingredients: ["150g chicken breast", "1.5 cups white rice", "Light seasoning", "Steamed vegetables"] },
    { name: "Turkey & Whole Grain Toast", time: "2 hrs before", macros: "45g carbs · 30g protein · 8g fat", why: "Lean protein with moderate carbs — good for lighter pre-game meals.", ingredients: ["3-4 slices turkey", "2 slices whole grain toast", "Mustard or avocado"] },
    { name: "Greek Yogurt Parfait", time: "1.5 hrs before", macros: "40g carbs · 20g protein · 4g fat", why: "Light on the stomach, quick protein and carbs without heaviness.", ingredients: ["1 cup Greek yogurt", "1/2 cup granola", "Mixed berries", "Drizzle of honey"] },
  ],
  "Post-Game": [
    { name: "Protein Shake + Banana", time: "Within 30 min", macros: "40g carbs · 30g protein · 5g fat", why: "Fastest way to start muscle recovery. Simple and effective.", ingredients: ["1 scoop whey protein", "250ml milk or water", "1 banana", "Ice"] },
    { name: "Salmon & Sweet Potato", time: "1 hr after", macros: "55g carbs · 38g protein · 12g fat", why: "Omega-3s in salmon reduce inflammation and accelerate recovery.", ingredients: ["180g salmon fillet", "1 large sweet potato", "Lemon + herbs", "Asparagus or broccoli"] },
    { name: "Chicken Stir Fry & Rice", time: "1 hr after", macros: "65g carbs · 40g protein · 8g fat", why: "Replenishes glycogen stores and provides amino acids for muscle repair.", ingredients: ["200g chicken breast", "2 cups jasmine rice", "Mixed vegetables", "Soy sauce + sesame oil"] },
    { name: "Eggs & Whole Grain Toast", time: "1 hr after", macros: "35g carbs · 24g protein · 14g fat", why: "Complete protein from eggs supports muscle synthesis. Quick to prepare.", ingredients: ["3 whole eggs", "2 slices whole grain toast", "Avocado", "Spinach or tomato"] },
  ],
  "Daily Meals": [
    { name: "Overnight Oats", time: "Breakfast", macros: "60g carbs · 15g protein · 8g fat", why: "Prep the night before — zero effort, high nutrition breakfast.", ingredients: ["1 cup oats", "1 cup milk", "Chia seeds", "Fruit of choice", "Protein powder (optional)"] },
    { name: "Chicken Burrito Bowl", time: "Lunch", macros: "75g carbs · 42g protein · 10g fat", why: "Balanced macros to fuel your afternoon training session.", ingredients: ["200g chicken breast", "Rice", "Black beans", "Corn, salsa, guac", "Greek yogurt instead of sour cream"] },
    { name: "Tuna Pasta", time: "Lunch", macros: "70g carbs · 35g protein · 6g fat", why: "High protein, budget-friendly and quick. Perfect for athletes.", ingredients: ["1 can tuna", "Pasta", "Olive oil", "Lemon", "Cherry tomatoes"] },
    { name: "Steak & Baked Potato", time: "Dinner", macros: "60g carbs · 45g protein · 15g fat", why: "Red meat provides creatine and iron — crucial for athletic performance.", ingredients: ["200g lean steak (sirloin)", "1 large baked potato", "Butter + sour cream", "Side salad"] },
  ],
  "Snacks": [
    { name: "Rice Cakes + Peanut Butter", time: "Anytime", macros: "25g carbs · 8g protein · 10g fat", why: "Quick energy with healthy fats. Great pre-workout snack.", ingredients: ["2-3 rice cakes", "2 tbsp peanut butter"] },
    { name: "Protein Bar", time: "On the go", macros: "30g carbs · 20g protein · 8g fat", why: "Convenient option when you can't prepare food. Look for 20g+ protein.", ingredients: ["Choose bars with <10g sugar", "20g+ protein", "Avoid artificial fillers"] },
    { name: "Apple + Almonds", time: "Between meals", macros: "25g carbs · 6g protein · 14g fat", why: "Sustained energy without the crash. Keeps hunger away between meals.", ingredients: ["1 medium apple", "30g almonds (small handful)"] },
    { name: "Cottage Cheese + Fruit", time: "Before bed", macros: "20g carbs · 25g protein · 4g fat", why: "Casein protein in cottage cheese feeds your muscles overnight while you sleep.", ingredients: ["1 cup cottage cheese", "Mixed berries or peach", "Drizzle of honey"] },
  ],
};

export default function NutritionPage() {
  const [tab, setTab] = useState<keyof typeof MEALS>("Pre-Game");
  const [expanded, setExpanded] = useState<number | null>(null);
  const tabs = Object.keys(MEALS) as (keyof typeof MEALS)[];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px" }}>
        <Link href="/dashboard" style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <span style={{ fontWeight: 700 }}>🥗 Athlete Nutrition</span>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "8px", fontSize: "13px" }}>← Dashboard</button></Link>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Fuel Like An Athlete</h1>
        <p style={{ color: "var(--text2)", marginBottom: "32px" }}>What you eat determines how you perform. Follow these plans to maximise your energy, recovery and gains.</p>

        {/* Hydration tip */}
        <div style={{ background: "var(--bg2)", border: "1px solid #1a4a6e", borderRadius: "16px", padding: "20px 24px", marginBottom: "32px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "24px" }}>💧</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>Hydration Rule</div>
            <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.6 }}>Drink <strong>500ml water 2 hours before</strong> training, sip <strong>200-300ml every 20 mins during</strong>, and drink <strong>500-750ml post-game</strong>. Add electrolytes if training over 60 minutes.</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => { setTab(t); setExpanded(null); }} style={{
              padding: "10px 22px", borderRadius: "100px", fontSize: "14px", fontWeight: 600,
              background: tab === t ? "var(--accent)" : "var(--bg2)",
              border: `1px solid ${tab === t ? "var(--accent)" : "var(--border)"}`,
              color: tab === t ? "#fff" : "var(--text2)",
            }}>{t}</button>
          ))}
        </div>

        {/* Meals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {MEALS[tab].map((meal, i) => {
            const isOpen = expanded === i;
            return (
              <div key={i} onClick={() => setExpanded(isOpen ? null : i)} style={{
                background: "var(--bg2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "16px", padding: "20px 24px", cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "17px" }}>{meal.name}</div>
                    <div style={{ display: "flex", gap: "12px", marginTop: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>⏰ {meal.time}</span>
                      <span style={{ fontSize: "12px", color: "var(--text2)" }}>{meal.macros}</span>
                    </div>
                  </div>
                  <span style={{ color: "var(--text2)", fontSize: "20px" }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                    <div style={{ background: "var(--bg3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)" }}>Why this meal? </span>
                      <span style={{ fontSize: "13px", color: "var(--text2)" }}>{meal.why}</span>
                    </div>
                    <div style={{ fontWeight: 700, marginBottom: "10px", fontSize: "14px" }}>Ingredients:</div>
                    {meal.ingredients.map((ing, ii) => (
                      <div key={ii} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "14px", color: "var(--text2)" }}>
                        <span style={{ color: "var(--green)" }}>✓</span> {ing}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
