export function norm(s=""){
  return String(s).toLowerCase().replace(/ё/g,"е").replace(/[.,!?;:()[\]"«»]/g," ").replace(/\s+/g," ").trim();
}
export function tokens(s=""){
  return [...new Set(norm(s).split(/[^a-zа-я0-9-]+/i).filter(x=>x.length>=3))];
}
export function similarity(a,b){
  const A=new Set(tokens(a)),B=new Set(tokens(b));
  if(!A.size||!B.size)return 0;
  let n=0; for(const x of A)if(B.has(x))n++;
  return n/Math.max(A.size,B.size);
}
export function cleanAddress(s=""){
  return String(s).trim().replace(/^\s*(мия|мие|мией|эдит|эдитке|эдитой)\s*[,!?.:]?\s*/i,"").trim();
}
export function extractName(s=""){
  const m=String(s).match(/(?:меня\s+зовут|мо[её]\s+имя)\s+([а-яёa-z-]{2,30})/i);
  return m?.[1] || null;
}
export function isQuestion(s=""){
  return /\?$/.test(String(s).trim()) || /^(кто|что|как|зачем|почему|где|когда|можно ли|правда ли)\b/i.test(String(s).trim());
}
