import {load,save} from "../core/storage.js";
import {norm} from "../core/text.js";
export class SharedMemory{
  constructor(){this.data=load("mia_shared_memory_v2",{facts:[],concepts:{},relations:[],episodes:[],cycles:0})}
  fact(text,source="shared",confidence=.55){
    let f=this.data.facts.find(x=>norm(x.text)===norm(text));
    if(f){f.support=(f.support||1)+1;f.confidence=Math.min(1,(f.confidence||.5)+.05)}
    else this.data.facts.push({text,source,confidence,support:1});
    this.data.cycles++;save("mia_shared_memory_v2",this.data);
  }
  recall(q){
    const n=norm(q);
    return this.data.facts.filter(x=>norm(x.text).split(" ").some(w=>n.includes(w))).slice(-8);
  }
  stats(){return {facts:this.data.facts.length,cycles:this.data.cycles}}
}
