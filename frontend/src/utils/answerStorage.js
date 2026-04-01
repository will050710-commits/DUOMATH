export function loadAnswers(sectionKey) {
  return JSON.parse(localStorage.getItem(sectionKey) || "{}");
}

export function saveAnswer(sectionKey, key, value) {
  const current = loadAnswers(sectionKey);
  const updated = { ...current, [key]: value };
  localStorage.setItem(sectionKey, JSON.stringify(updated));
}

export function clearAllAnswers(testId) {
  const exam = testId || localStorage.getItem("currentTest") || "reading-test-1";

  localStorage.removeItem(`${exam}_section1`);
  localStorage.removeItem(`${exam}_section2`);
  localStorage.removeItem(`${exam}_section3`);
  // backward-compat: also clear legacy keys used by older components
  localStorage.removeItem("readingTest_section1");
  localStorage.removeItem("readingTest_section2");
  localStorage.removeItem("readingTest_section3");
}