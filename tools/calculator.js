export function calculate(text){
  const x=String(text).replace(/,/g,".").replace(/=/g,"").trim();
  if(!/^[\d\s+\-*/().%^]+$/.test(x))return null;
  try{
    const r=Function('"use strict";return ('+x.replace(/\^/g,"**")+')')();
    return Number.isFinite(r)?r:null;
  }catch{return null}
}
