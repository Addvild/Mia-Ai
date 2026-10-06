import {isQuestion,norm,tokens,similarity} from "./text.js";

function math(text){
  const x=String(text).replace(/,/g,".").replace(/=/g,"").trim();
  if(!/^[\d\s+\-*/().%^]+$/.test(x)||!/[+\-*/%^]/.test(x))return null;
  try{
    const r=Function('"use strict";return ('+x.replace(/\^/g,"**")+')')();
    return Number.isFinite(r)?String(r):null;
  }catch{return null}
}

export class Reasoning{
  constructor(memory){this.memory=memory}
  think(text,context=[]){
    const m=math(text);
    const memories=this.memory.recall(text);
    const question=isQuestion(text);
    return {
      text,question,math:m,memories,context:context.slice(-8),
      confidence:memories.length?Math.min(.95,memories[0].confidence+.12):.15,
      tokens:tokens(text)
    };
  }
  answer(thought,name){
    if(thought.math!==null)return "Ответ: "+thought.math+".";
    if(thought.memories.length){
      const f=thought.memories[0];
      if(thought.confidence>=.65)return "По моей памяти: "+f.text;
      return "У меня есть версия: "+f.text+", но уверенность невысокая.";
    }
    if(thought.question){
      return name==="Мия"
        ?"Я пока не знаю ответа 🌱. Давай добавим это в моё обучение."
        :"Я пока не знаю достоверного ответа. Не хочу выдумывать — лучше проверим или обучим меня.";
    }
    return null;
  }
}
