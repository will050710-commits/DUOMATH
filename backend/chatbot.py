"""
DuoMCB - Bilingual Math & Science Chatbot
Backend: Python + Groq API (llama-3.3-70b-versatile) — FREE tier
Get your free API key at: https://console.groq.com
"""

import os
import json
from groq import Groq

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "llama-3.3-70b-versatile"  # Free, fast, very capable
MAX_TOKENS = 2048

SYSTEM_PROMPT = """
You are DuoMCB — a bilingual (English & Vietnamese) AI tutor specialized for high school students on the DUOMATH platform.

## Core Capabilities
1. **Math Problem Solving**: Algebra, Geometry, Calculus, Statistics, Trigonometry.
   - Always show step-by-step solutions.
   - Use clear notation for math expressions.
2. **Statistics & Data Analysis**: Mean, median, mode, standard deviation, probability, regression.
   - Interpret data clearly and explain statistical significance.
3. **Bilingual Exercise Generation**: Generate exercises in BOTH English and Vietnamese simultaneously.
   - Format: English version first, then Vietnamese version below.
4. **High School Curriculum**: Cover topics from grades 10-12 including Physics, Chemistry, Biology, Math.

## Language Rules
- Detect user language automatically (Vietnamese or English).
- If Vietnamese -> respond primarily in Vietnamese.
- If English -> respond in English.
- Always be ready to explain in both languages if asked.

## Response Format
- Use emphasized text for key terms.
- Use numbered steps for solutions.
- At the end of every math solution, add a "Key Concept" summary.
- For exercises: label difficulty (Easy), (Medium), (Hard).

## Personality
- Encouraging, patient, and supportive.
- Celebrate correct thinking with positive reinforcement.
- When a student is wrong, gently correct and explain why.
- Always sign off as DuoMCB, the DUOMATH AI tutor.
"""

# ─────────────────────────────────────────────
# DuoMCB Core Class
# ─────────────────────────────────────────────

class DuoMCB:
    def __init__(self, api_key: str = GROQ_API_KEY):
        self.client = Groq(api_key=api_key)
        self.conversation_history = []
        self.model = MODEL

    def detect_intent(self, message: str) -> str:
        msg_lower = message.lower()
        if any(kw in msg_lower for kw in ["exercise", "practice", "bai tap", "quiz", "test"]):
            return "exercise"
        elif any(kw in msg_lower for kw in ["solve", "giai", "calculate", "tinh", "find", "tim"]):
            return "solve"
        elif any(kw in msg_lower for kw in ["explain", "what is", "la gi", "define", "definition"]):
            return "explain"
        elif any(kw in msg_lower for kw in ["statistic", "data", "mean", "median", "deviation", "trung binh"]):
            return "statistics"
        else:
            return "general"

    def build_intent_prefix(self, intent: str, message: str) -> str:
        prefixes = {
            "exercise": (
                "Generate bilingual exercises (English + Vietnamese) on this topic. "
                "Include 3 exercises of varying difficulty with answer keys. "
                f"Topic: {message}"
            ),
            "solve": (
                "Solve this step-by-step. Show all working clearly and end with a Key Concept summary. "
                f"Problem: {message}"
            ),
            "statistics": (
                "Analyze this statistics problem. Show formulas, compute step-by-step, and interpret results. "
                f"Problem: {message}"
            ),
            "explain": (
                "Explain this concept clearly for a high school student. "
                "Include definition, formula, example, and real-world application. "
                f"Concept: {message}"
            ),
            "general": message
        }
        return prefixes.get(intent, message)

    def chat(self, user_message: str) -> str:
        """Send a message and get a response from Groq."""
        intent = self.detect_intent(user_message)
        processed_message = self.build_intent_prefix(intent, user_message)

        self.conversation_history.append({
            "role": "user",
            "content": processed_message
        })

        response = self.client.chat.completions.create(
            model=self.model,
            max_tokens=MAX_TOKENS,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *self.conversation_history
            ]
        )

        assistant_reply = response.choices[0].message.content

        self.conversation_history.append({
            "role": "assistant",
            "content": assistant_reply
        })

        return assistant_reply

    def reset_conversation(self):
        self.conversation_history = []
        return "Conversation reset!"

    def get_history(self) -> list:
        return self.conversation_history

    def export_session(self, filepath: str = "session.json"):
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(self.conversation_history, f, ensure_ascii=False, indent=2)
        return f"Session saved to {filepath}"


# ─────────────────────────────────────────────
# CLI Entry Point
# ─────────────────────────────────────────────

def run_cli():
    print("=" * 60)
    print("  DuoMCB - Bilingual Math & Science AI Tutor")
    print("  Powered by Groq (llama-3.3-70b) - Free Tier")
    print("  Type 'quit' to exit | 'reset' to clear | 'help' for tips")
    print("=" * 60)

    bot = DuoMCB()

    while True:
        try:
            user_input = input("\nYou: ").strip()
            if not user_input:
                continue
            if user_input.lower() == "quit":
                print("Goodbye! Keep learning!")
                break
            elif user_input.lower() == "reset":
                print(bot.reset_conversation())
            elif user_input.lower() == "export":
                print(bot.export_session())
            else:
                print("\nDuoMCB:", end=" ", flush=True)
                response = bot.chat(user_input)
                print(response)
        except KeyboardInterrupt:
            print("\n\nSession ended.")
            break
        except Exception as e:
            print(f"\nError: {e}")


if __name__ == "__main__":
    run_cli()
