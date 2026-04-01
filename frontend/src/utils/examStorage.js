export const startTimer = (examId, minutes) => {
  const key = `endTime_${examId}`;
  const startKey = `startTime_${examId}`;

  if (!localStorage.getItem(key)) {
    const end = Date.now() + minutes * 60 * 1000;
    localStorage.setItem(key, end);
    localStorage.setItem(startKey, Date.now());
  }
};

export const getRemainingTime = (examId) => {
  const end = localStorage.getItem(`endTime_${examId}`);
  if (!end) return 0;
  return Math.max(0, Math.floor((end - Date.now()) / 1000));
};

export const getTimeSpent = (examId) => {
  const start = localStorage.getItem(`startTime_${examId}`);
  if (!start) return 0;
  return Math.floor((Date.now() - start) / 1000);
};

export const clearExam = (examId) => {
  localStorage.removeItem(`endTime_${examId}`);
  localStorage.removeItem(`startTime_${examId}`);
  localStorage.removeItem(`answers_${examId}`);
};

export const formatTime = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2,"0");
  const s = String(seconds % 60).padStart(2,"0");
  return `${m}:${s}`;
};