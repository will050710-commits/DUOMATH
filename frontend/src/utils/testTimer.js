export function startTimer(testKey, minutes = 60) {
  const startKey = `start-${testKey}`;
  const endKey = `end-${testKey}`;

  if (!localStorage.getItem(endKey)) {
    const start = Date.now();
    const end = start + minutes * 60 * 1000;

    localStorage.setItem(startKey, start);
    localStorage.setItem(endKey, end);
  }
}

export function getRemainingTime(testKey) {
  const end = localStorage.getItem(`end-${testKey}`);
  if (!end) return 0;
  return Math.max(0, Math.floor((end - Date.now()) / 1000));
}

export function getTimeSpent(testKey) {
  const start = localStorage.getItem(`start-${testKey}`);
  if (!start) return 0;
  return Math.floor((Date.now() - start) / 1000);
}

export function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function resetTimer(testKey) {
  localStorage.removeItem(`start-${testKey}`);
  localStorage.removeItem(`end-${testKey}`);
}

// Clear one full test session: timer + answers + result artifacts.
export function clearTestSession(testKey) {
  localStorage.removeItem(`start-${testKey}`);
  localStorage.removeItem(`end-${testKey}`);

  localStorage.removeItem(`${testKey}_section1`);
  localStorage.removeItem(`${testKey}_section2`);
  localStorage.removeItem(`${testKey}_section3`);

  // backward compatibility keys used by older pages
  localStorage.removeItem("readingTest_section1");
  localStorage.removeItem("readingTest_section2");
  localStorage.removeItem("readingTest_section3");

  localStorage.removeItem("readingTest_result");
  localStorage.removeItem("timeSpent");
  localStorage.removeItem("lastTimeSpent");
}