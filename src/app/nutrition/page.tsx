"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
const NutritionBowl3D = dynamic(() => import("@/components/NutritionBowl3D"), { ssr: false });

const MEALS = {
  "Pre-Game": [
    { name: "Oats + Banana + Honey", time: "2-3 hrs before", macros: "65g carbs · 8g protein · 3g fat · 320 cal", why: "Slow-release carbs for sustained energy. No crashes mid-game.", ingredients: ["1 cup rolled oats", "1 banana", "1 tbsp honey", "Pinch of salt", "250ml milk or water"] },
    { name: "Chicken & White Rice", time: "3 hrs before", macros: "70g carbs · 35g protein · 5g fat · 470 cal", why: "Classic athlete pre-game meal. Easy to digest, loads glycogen.", ingredients: ["150g chicken breast", "1.5 cups white rice", "Light seasoning", "Steamed broccoli"] },
    { name: "Turkey & Whole Grain Toast", time: "2 hrs before", macros: "45g carbs · 30g protein · 8g fat · 370 cal", why: "Lean protein with moderate carbs for lighter pre-game fuelling.", ingredients: ["3-4 slices turkey breast", "2 slices whole grain toast", "Mustard or avocado", "Sliced tomato"] },
    { name: "Greek Yogurt Parfait", time: "1.5 hrs before", macros: "40g carbs · 20g protein · 4g fat · 280 cal", why: "Light on the stomach, quick protein and carbs without heaviness.", ingredients: ["1 cup Greek yogurt (0%)", "1/2 cup granola", "Mixed berries", "Drizzle of honey"] },
    { name: "Bagel + Peanut Butter + Banana", time: "2 hrs before", macros: "75g carbs · 14g protein · 12g fat · 460 cal", why: "High carb, moderate fat — classic pre-game combo used by pro athletes.", ingredients: ["1 whole grain bagel", "2 tbsp peanut butter", "1 banana"] },
    { name: "Pasta with Tomato Sauce", time: "3 hrs before", macros: "85g carbs · 18g protein · 6g fat · 470 cal", why: "Carb loading classic. High glycogen stores for extended energy.", ingredients: ["2 cups cooked pasta", "Lean turkey mince", "Tomato sauce", "Parmesan"] },
    { name: "Rice Cakes + Almond Butter + Honey", time: "1 hr before", macros: "35g carbs · 7g protein · 9g fat · 250 cal", why: "Fast digesting, light on the stomach. Won't slow you down.", ingredients: ["3-4 rice cakes", "2 tbsp almond butter", "Drizzle of honey"] },
    { name: "Sweet Potato + Chicken Bowl", time: "2-3 hrs before", macros: "60g carbs · 38g protein · 5g fat · 440 cal", why: "Complex carbs + lean protein. Steady energy release through the game.", ingredients: ["1 large sweet potato", "180g chicken breast", "Olive oil", "Salt, pepper, paprika"] },
  ],
  "Post-Game": [
    { name: "Protein Shake + Banana", time: "Within 30 min", macros: "40g carbs · 30g protein · 5g fat · 325 cal", why: "Fastest recovery window. Replenish glycogen and start muscle repair immediately.", ingredients: ["1 scoop whey protein", "250ml milk", "1 banana", "Ice"] },
    { name: "Salmon & Sweet Potato", time: "1 hr after", macros: "55g carbs · 38g protein · 12g fat · 480 cal", why: "Omega-3s in salmon reduce muscle inflammation and accelerate recovery.", ingredients: ["180g salmon fillet", "1 large sweet potato", "Lemon + dill", "Asparagus"] },
    { name: "Chicken Stir Fry & Rice", time: "1 hr after", macros: "65g carbs · 40g protein · 8g fat · 496 cal", why: "Replenishes glycogen stores and amino acids for muscle repair.", ingredients: ["200g chicken breast", "2 cups jasmine rice", "Mixed vegetables", "Soy sauce + sesame oil"] },
    { name: "Eggs & Whole Grain Toast", time: "45 min after", macros: "35g carbs · 24g protein · 14g fat · 360 cal", why: "Complete protein from eggs supports muscle protein synthesis.", ingredients: ["3 whole eggs", "2 slices whole grain toast", "Avocado", "Spinach"] },
    { name: "Tuna Rice Bowl", time: "1 hr after", macros: "60g carbs · 35g protein · 5g fat · 420 cal", why: "Lean protein + carbs. Budget-friendly and highly effective.", ingredients: ["2 cans tuna (in water)", "1.5 cups rice", "Lemon", "Cucumber, corn"] },
    { name: "Beef & Vegetable Stir Fry", time: "1 hr after", macros: "50g carbs · 42g protein · 10g fat · 456 cal", why: "Creatine in beef supports muscle recovery and strength regeneration.", ingredients: ["200g lean beef strips", "Mixed vegetables", "Brown rice", "Oyster sauce"] },
    { name: "Cottage Cheese & Fruit Bowl", time: "Before bed after game", macros: "30g carbs · 28g protein · 4g fat · 268 cal", why: "Casein protein feeds muscles overnight. Perfect night-after-game meal.", ingredients: ["1 cup cottage cheese", "Mixed berries", "Peach slices", "Honey"] },
    { name: "Turkey Meatballs & Pasta", time: "1.5 hrs after", macros: "70g carbs · 38g protein · 9g fat · 510 cal", why: "High protein, high carb combo for full glycogen and muscle restoration.", ingredients: ["200g turkey mince", "Pasta", "Tomato sauce", "Herbs"] },
  ],
  "Daily Meals": [
    { name: "Overnight Oats", time: "Breakfast", macros: "60g carbs · 22g protein · 8g fat · 400 cal", why: "Prep the night before. Zero effort, sustained energy all morning.", ingredients: ["1 cup oats", "1 cup milk", "1 scoop protein powder", "Chia seeds", "Fruit"] },
    { name: "Chicken Burrito Bowl", time: "Lunch", macros: "75g carbs · 42g protein · 10g fat · 566 cal", why: "Balanced macros to fuel afternoon training. High protein keeps you full.", ingredients: ["200g chicken breast", "Rice", "Black beans", "Corn, salsa, guac"] },
    { name: "Tuna Pasta Salad", time: "Lunch", macros: "65g carbs · 35g protein · 8g fat · 472 cal", why: "High protein, budget-friendly and quick. Perfect for athletes on the go.", ingredients: ["2 cans tuna", "Pasta", "Olive oil", "Lemon", "Cherry tomatoes", "Cucumber"] },
    { name: "Steak & Baked Potato", time: "Dinner", macros: "60g carbs · 45g protein · 15g fat · 555 cal", why: "Red meat provides creatine and iron — crucial for athletic performance.", ingredients: ["200g lean sirloin", "1 large baked potato", "Greek yogurt instead of sour cream", "Side salad"] },
    { name: "Salmon & Brown Rice", time: "Dinner", macros: "55g carbs · 40g protein · 14g fat · 508 cal", why: "Anti-inflammatory omega-3s + complex carbs. Excellent recovery dinner.", ingredients: ["180g salmon", "1.5 cups brown rice", "Steamed broccoli", "Lemon butter"] },
    { name: "Chicken & Vegetable Soup", time: "Lunch or Dinner", macros: "30g carbs · 35g protein · 6g fat · 314 cal", why: "Light, anti-inflammatory, hydrating. Great on rest days.", ingredients: ["200g chicken breast", "Mixed vegetables", "Chicken broth", "Noodles or rice"] },
    { name: "Ground Turkey Tacos", time: "Dinner", macros: "50g carbs · 38g protein · 12g fat · 460 cal", why: "Lean protein + moderate carbs. Versatile and easy to meal prep.", ingredients: ["200g turkey mince", "Corn tortillas", "Salsa", "Avocado", "Greek yogurt"] },
    { name: "Egg White Omelette", time: "Breakfast", macros: "10g carbs · 30g protein · 8g fat · 230 cal", why: "Low calorie, high protein. Perfect for morning before a later workout.", ingredients: ["5 egg whites", "1 whole egg", "Spinach", "Mushrooms", "Feta"] },
    { name: "Protein Pancakes", time: "Breakfast", macros: "55g carbs · 28g protein · 8g fat · 408 cal", why: "High protein breakfast that feels like a treat but fuels like a meal.", ingredients: ["1 scoop protein powder", "1 cup oat flour", "2 eggs", "Milk", "Banana"] },
    { name: "Quinoa Power Bowl", time: "Lunch", macros: "50g carbs · 28g protein · 12g fat · 420 cal", why: "Complete protein from quinoa + healthy fats. Excellent anti-inflammatory lunch.", ingredients: ["1 cup quinoa", "Chickpeas", "Avocado", "Cucumber", "Feta", "Lemon dressing"] },
  ],
  "Snacks": [
    { name: "Rice Cakes + Peanut Butter", time: "Pre-workout", macros: "25g carbs · 8g protein · 10g fat · 220 cal", why: "Quick energy with healthy fats. Great 45-60 min before training.", ingredients: ["3 rice cakes", "2 tbsp peanut butter"] },
    { name: "Protein Bar", time: "On the go", macros: "30g carbs · 20g protein · 8g fat · 272 cal", why: "Convenient when you can't prepare food. Look for 20g+ protein.", ingredients: ["Choose bars with <10g sugar", "20g+ protein target"] },
    { name: "Apple + Almonds", time: "Between meals", macros: "25g carbs · 6g protein · 14g fat · 242 cal", why: "Sustained energy without a crash. Keeps hunger at bay for hours.", ingredients: ["1 medium apple", "30g almonds"] },
    { name: "Cottage Cheese + Fruit", time: "Before bed", macros: "20g carbs · 25g protein · 4g fat · 212 cal", why: "Casein protein feeds your muscles while you sleep.", ingredients: ["1 cup cottage cheese", "Mixed berries", "Honey"] },
    { name: "Hard Boiled Eggs + Fruit", time: "Mid-morning", macros: "20g carbs · 18g protein · 10g fat · 238 cal", why: "Complete protein snack. Easy to prep in bulk.", ingredients: ["2 hard boiled eggs", "1 piece of fruit"] },
    { name: "Greek Yogurt + Granola", time: "Morning snack", macros: "35g carbs · 18g protein · 5g fat · 253 cal", why: "Protein + carbs. Great after a morning workout.", ingredients: ["3/4 cup Greek yogurt", "1/4 cup granola", "Berries"] },
    { name: "Banana + Whey Shake", time: "Post-workout", macros: "45g carbs · 28g protein · 3g fat · 319 cal", why: "Fast digesting. Hit this within 30 minutes of finishing training.", ingredients: ["1 banana", "1 scoop whey", "Water or milk"] },
    { name: "Edamame", time: "Anytime", macros: "12g carbs · 17g protein · 8g fat · 188 cal", why: "Complete plant protein snack. Underrated by most athletes.", ingredients: ["1 cup edamame (shelled)", "Sea salt"] },
    { name: "Tuna on Rice Cakes", time: "Afternoon", macros: "20g carbs · 25g protein · 3g fat · 207 cal", why: "High protein, very low fat. Excellent cutting or lean bulk snack.", ingredients: ["1 can tuna", "3 rice cakes", "Lemon juice", "Black pepper"] },
    { name: "Smoothie Bowl", time: "Breakfast or snack", macros: "55g carbs · 15g protein · 7g fat · 343 cal", why: "Nutrient dense and fast. Load with toppings for extra fuel.", ingredients: ["Frozen mixed berries", "Banana", "Protein powder", "Almond milk", "Granola topping"] },
  ],
  "Hydration": [
    { name: "Pre-Training Hydration", time: "2 hrs before", macros: "0g carbs · 0g protein · 0g fat · 0 cal", why: "Pre-loading fluids prevents early dehydration and maintains performance.", ingredients: ["500ml water 2 hours before", "Add electrolytes if hot weather", "Avoid caffeine 30 min before if sensitive"] },
    { name: "During Training", time: "Every 20 min", macros: "15g carbs · 0g protein · 0g fat · 60 cal", why: "Replacing sweat prevents cramping and performance drops.", ingredients: ["200-300ml water every 20 minutes", "Sports drink if session over 60 min", "Electrolytes (sodium, potassium) in hot conditions"] },
    { name: "Post-Training Rehydration", time: "After training", macros: "0g carbs · 0g protein · 0g fat · 0 cal", why: "Replacing fluid lost through sweat is critical for recovery.", ingredients: ["500-750ml water post-session", "Add pinch of salt for electrolytes", "Coconut water is also excellent"] },
    { name: "Morning Hydration Routine", time: "First thing AM", macros: "0g carbs · 0g protein · 0g fat · 0 cal", why: "You wake up dehydrated after 8 hours. This fixes it immediately.", ingredients: ["500ml water immediately on waking", "Add lemon juice optionally", "Before coffee or food"] },
    { name: "Electrolyte Drink", time: "Long sessions", macros: "20g carbs · 0g protein · 0g fat · 80 cal", why: "For sessions over 90 minutes. Prevents cramping and fatigue.", ingredients: ["Water", "Pinch of salt", "Pinch of sugar or honey", "Lemon juice", "Or use a sports drink"] },
  ],
};

const TAB_COLORS: Record<string, string> = {
  "Pre-Game": "#0EA5E9",
  "Post-Game": "#8B5CF6",
  "Daily Meals": "#10B981",
  "Snacks": "#F59E0B",
  "Hydration": "#06B6D4",
};

export default function NutritionPage() {
  const [tab, setTab] = useState<keyof typeof MEALS>("Pre-Game");
  const [expanded, setExpanded] = useState<number | null>(null);
  const tabs = Object.keys(MEALS) as (keyof typeof MEALS)[];
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Sidebar />

      <main className="inner-main" style={{ flex: 1, padding: "48px 52px", maxWidth: "900px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <p style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Nutrition</p>
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1, marginBottom: "8px" }}>Fuel Like An Athlete</h1>
            <p style={{ color: "var(--text2)", fontSize: "14px" }}>{Object.values(MEALS).flat().length}+ meals across every training need. Spin the bowl.</p>
          </div>
          <div style={{ width: "280px", flexShrink: 0 }}>
            <NutritionBowl3D />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "32px", flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => { setTab(t); setExpanded(null); }} style={{
              padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 500,
              background: tab === t ? TAB_COLORS[t] : "var(--bg2)",
              border: `1px solid ${tab === t ? TAB_COLORS[t] : "var(--border)"}`,
              color: tab === t ? "#fff" : "var(--text2)",
              cursor: "pointer", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "20px", fontWeight: 500 }}>
          {MEALS[tab].length} options
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {MEALS[tab].map((meal, i) => {
            const isOpen = expanded === i;
            const color = TAB_COLORS[tab];
            return (
              <div key={i} onClick={() => setExpanded(isOpen ? null : i)} style={{
                background: "var(--bg2)",
                border: `1px solid ${isOpen ? color : "var(--border)"}`,
                borderLeft: `3px solid ${isOpen ? color : "var(--border)"}`,
                borderRadius: "8px", padding: "16px 20px", cursor: "pointer", transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{meal.name}</div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color, fontWeight: 600 }}>{meal.time}</span>
                      <span style={{ fontSize: "12px", color: "var(--text3)" }}>{meal.macros}</span>
                    </div>
                  </div>
                  <span style={{ color: "var(--text3)", fontSize: "16px", flexShrink: 0, marginLeft: "16px" }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                    <div style={{ background: "var(--bg3)", borderRadius: "6px", padding: "12px 14px", marginBottom: "14px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.5px" }}>Why: </span>
                      <span style={{ fontSize: "13px", color: "var(--text2)" }}>{meal.why}</span>
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Ingredients</div>
                    {meal.ingredients.map((ing, ii) => (
                      <div key={ii} style={{ display: "flex", gap: "10px", marginBottom: "6px", fontSize: "13px", color: "var(--text2)", alignItems: "center" }}>
                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                        {ing}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
