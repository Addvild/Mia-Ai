import {load,save} from "../core/storage.js";
import {norm,tokens,similarity,extractName} from "../core/text.js";

export class Memory{
  constructor(owner,key){
    this.owner=owner;this.key=key;
    this.data=load(key,{facts:[],episodes:[],concepts:{},relations:[],corrections:[]});
  }
  persist(){save(this.key,this.data)}
  fact(text,source="experience",confidence=.6){
    text=String(text||"").trim();if(!text)return;
    let f=this.data.facts.find(x=>norm(x.text)===norm(text));
    if(f){f.support=(f.support||1)+1;f.confidence=Math.min(1,(f.confidence||.5)+.06)}
    else this.data.facts.push({text,source,confidence,support:1,created:new Date().toISOString()});
    this.data.facts=this.data.facts.slice(-1500);this.persist();
  }
  episode(text,role="user"){
    this.data.episodes.push({text,role,date:new Date().toISOString()});
    this.data.episodes=this.data.episodes.slice(-800);this.persist();
  }
  activate(text){
    for(const w of tokens(text)){
      this.data.concepts[w]??={count:0,weight:.1};
      this.data.concepts[w].count++;
      this.data.concepts[w].weight=Math.min(1,this.data.concepts[w].weight+.02);
    }
    this.persist();
  }
  relation(a,r,b,c=.6){
    const found=this.data.relations.find(x=>norm(x.a)===norm(a)&&norm(x.r)===norm(r)&&norm(x.b)===norm(b));
    if(found){found.support=(found.support||1)+1;found.confidence=Math.min(1,(found.confidence||.5)+.05)}
    else this.data.relations.push({a,r,b,confidence:c,support:1});
    this.persist();
  }
  recall(query,limit=8){
    return this.data.facts.map(f=>({
      ...f,score:similarity(query,f.text)*3+(f.confidence||.5)
    })).filter(x=>x.score>.7).sort((a,b)=>b.score-a.score).slice(0,limit);
  }
  name(){
    const f=this.data.facts.find(x=>norm(x.text).startsWith("пользователя зовут "));
    return f?.text.replace(/^Пользователя зовут\s+/i,"")||null;
  }
  stats(){return {facts:this.data.facts.length,concepts:Object.keys(this.data.concepts).length,relations:this.data.relations.length,episodes:this.data.episodes.length}}
}
