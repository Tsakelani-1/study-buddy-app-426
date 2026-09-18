export type AiMode = "explain" | "practice" | "summary" | "chat";

const clean = (t: string) => t.replace(/[?.!]+$/, "").trim() || "this topic";

export function demoAnswer(question: string, mode: AiMode): string {
  const topic = clean(question);

  switch (mode) {
    case "explain":
      return [
        `**${topic} — explained simply**`,
        "",
        `Think of ${topic} like a recipe: there are a few ingredients, and they always work in the same order.`,
        "",
        "1. Start with the big idea in one sentence you could say out loud to a friend.",
        "2. Name the two or three parts that make it work, and what each part does.",
        "3. Find one everyday example that matches the pattern.",
        "",
        "Quick check: if you can teach it in 60 seconds without notes, you understand it.",
      ].join("\n");
    case "practice":
      return [
        `**5 practice questions on ${topic}**`,
        "",
        `1. Define ${topic} in your own words (one sentence).`,
        `2. List the key parts or steps of ${topic} in the right order.`,
        `3. Give a real-world example where ${topic} applies, and say why.`,
        `4. What is the most common mistake students make with ${topic}?`,
        `5. Compare ${topic} with a related idea — one similarity, one difference.`,
        "",
        "Tip: answer from memory first, then check your notes and mark yourself honestly.",
      ].join("\n");
    case "summary":
      return [
        `**${topic} — summary**`,
        "",
        `• Core idea: ${topic} describes how the main parts fit together and why that matters.`,
        "• Key terms: write down three words you'd need in an exam answer.",
        "• Why it matters: it explains results you can observe or calculate.",
        "• Common trap: mixing up the order of the steps.",
        "",
        "Revise this in a 25-minute focus block, then rewrite the summary from memory.",
      ].join("\n");
    default:
      return [
        `Good question about ${topic}.`,
        "",
        `Here's how I'd approach it: break ${topic} into what you already know, what you half-know, and what is completely new. Spend your study time mostly on the middle group — that's where progress is fastest.`,
        "",
        "Try one of the buttons above for a simple explanation, practice questions, or a summary.",
      ].join("\n");
  }
}
