export class Reflection{
  check(answer,thought){
    if(!answer)return {ok:false,reason:"empty"};
    const risky=thought.question && !thought.memories.length && answer.length>180;
    return {ok:!risky,confidence:risky?.25:thought.confidence};
  }
}
