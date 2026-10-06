export class Planner{
  plan(text){
    const steps=[];
    if(/сделай|нужно|давай|хочу/i.test(text)){
      steps.push("понять цель");
      steps.push("найти известные данные");
      steps.push("разбить задачу на части");
      steps.push("выполнить части");
      steps.push("проверить результат");
    }
    return steps;
  }
}
