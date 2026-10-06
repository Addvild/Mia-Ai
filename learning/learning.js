import {extractName} from "../core/text.js";

export class Learning{
  constructor(memory,shared){
    this.memory=memory;this.shared=shared;
  }
  learn(text){
    const name=extractName(text);
    if(name){
      const fact="Пользователя зовут "+name;
      this.memory.fact(fact,"identity",1);
      this.shared.fact(fact,"identity",1);
    }
    const explicit=String(text).match(/(?:запомни|запомните|учись|учитесь)\s*[:,-]?\s*(.+)/i);
    if(explicit){
      this.memory.fact(explicit[1],"explicit",1);
      this.shared.fact(explicit[1],"explicit",1);
    }
    this.memory.activate(text);
    this.memory.episode(text,"user");
  }
  correction(text){
    const m=String(text).match(/(?:правильно|нет,\s*правильно|не так[,:]?)\s*(.+)/i);
    if(!m)return false;
    this.memory.fact(m[1],"correction",1);
    this.memory.data.corrections.push({text:m[1],date:new Date().toISOString()});
    this.memory.persist();
    this.shared.fact(m[1],"correction",1);
    return true;
  }
}
