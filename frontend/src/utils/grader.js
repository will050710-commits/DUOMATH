import { computeScoreAndMastery } from "./scoring";
import { getTimeSpent } from "./testTimer";

// Client-side wrapper around the pure scoring engine.
// It reads all test answers from localStorage and writes a rich result object back.
export function gradeTest() {
  const answersBySection = {};
  const testId = localStorage.getItem("currentTest") || "reading-test-1";

  ["section1", "section2", "section3"].forEach((section) => {
    const primaryKey = `${testId}_${section}`;
    const legacyKey = `readingTest_${section}`;
    const savedRaw =
      localStorage.getItem(primaryKey) || localStorage.getItem(legacyKey);
    answersBySection[section] = savedRaw ? JSON.parse(savedRaw) : {};
  });

  const result = computeScoreAndMastery(answersBySection);

  // Attach metadata so result page can determine which test this belongs to
  result.testId = testId;
  result.timeSpent = getTimeSpent(testId);

  localStorage.setItem("timeSpent", String(result.timeSpent));
  localStorage.setItem("readingTest_result", JSON.stringify(result));

  return result;
}
