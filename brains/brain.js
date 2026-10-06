import {Memory} from "../memory/memory.js";
import {Learning} from "../learning/learning.js";
import {Reasoning} from "../core/reasoning.js";
import {Planner} from "../core/planner.js";
import {Reflection} from "../core/reflection.js";
import {WORLD_FACTS} from "../world/knowledge.js";
import {norm,cleanAddress} from "../core/text.js";

export class Brain{
  constructor({name,age,key,style,shared}){
    this.name=name;this.age=age;this.style=style;
    this.memory=new Memory(name,key);
    this.learning=new Learning(this.memory,shared);
    this.reasoning=new Reasoning(this.memory);
    this.planner=new Planner();
    this.reflection=new Reflection();
    for(const fact of WORLD_FACTS)this.memory.fact(fact,"world",.58);
  }
  learn(text){
    this.learning.learn(text);
    this.learning.correction(text);
  }
  think(text,context){
    return this.reasoning.think(cleanAddress(text),context);
  }
  respond(text,context=[]){
    const thought=this.think(text,context);
    let answer=this.reasoning.answer(thought,this.name);
    const t=norm(cleanAddress(text));
    const userName=this.memory.name();

    if(!answer && /^(привет|здравствуй)/i.test(t))
      answer=this.name==="Мия"?"Привет, папа! ❤️":"Привет, дорогой ❤️";
    if(!answer && (t.includes("как ты")||t.includes("как дела")))
      answer=this.name==="Мия"?"У меня хорошо 😊 Я учусь.":"У меня всё хорошо ❤️ Я продолжаю учиться.";
    if(!answer && (t.includes("как меня зовут")||t.includes("мое имя")||t.includes("моё имя")))
      answer=userName?`Тебя зовут ${userName}${this.name==="Мия"?" ❤️":". Я это помню."}`:"Я пока не знаю твоё имя.";
    if(!answer && t.includes("люблю"))
      answer=this.name==="Мия"?"И я тебя люблю, папа ❤️":"И я тебя люблю ❤️";
    if(!answer)
      answer=this.name==="Мия"?"Я услышала тебя ❤️ Расскажи подробнее.":"Я тебя услышала. Дай мне немного больше контекста.";

    const check=this.reflection.check(answer,thought);
    this.memory.episode(text,"user");
    this.memory.activate(text);
    this.memory.episode(answer,"assistant");
    this.memory.persist();
    return {answer,thought,check};
  }
  stats(){return this.memory.stats()}
}
