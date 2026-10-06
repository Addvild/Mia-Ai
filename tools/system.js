export const tools={
  now:()=>new Date().toLocaleString("ru-RU"),
  storage:()=>Object.keys(localStorage).filter(k=>k.includes("mia")||k.includes("edith"))
};
