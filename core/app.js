import {load,save} from "./storage.js";
import {Context} from "./context.js";
import {norm,extractName} from "./text.js";
import {SharedMemory} from "../memory/shared.js";
import {createMia} from "../brains/mia/index.js";
import {createEdith} from "../brains/edith/index.js";
import {talk} from "../communication/dialogue.js";

const shared=new SharedMemory();
const mia=createMia(shared);
const edith=createEdith(shared);
const context=new Context(16);
let history=load("mia_ui_history_v2",[]);

const $=id=>document.getElementById(id);
const messages=$("messages");

function add(role,text){
  const el=document.createElement("div");el.className="msg "+role;
  const b=document.createElement("div");b.className="bubble";
  const who=document.createElement("span");who.className="who";
  who.textContent=role==="user"?"Ты":role==="mia"?"Мия · 6 лет":"Эдит · 30 лет";
  const body=document.createElement("span");body.textContent=text;
  b.append(who,body);el.append(b);messages.append(el);
  history.push({role,text});save("mia_ui_history_v2",history);
  messages.scrollTop=messages.scrollHeight;
}
function recipient(text){
  const n=norm(text);
  if(/^(мия|мие|мией)(?:[ ,:!?]|$)/i.test(n))return"mia";
  if(/^(эдит|эдитке|эдитой)(?:[ ,:!?]|$)/i.test(n))return"edith";
  return"both";
}
function updateMode(r){
  $("modeTitle").textContent=r==="mia"?"Мия":r==="edith"?"Эдит":"Мия + Эдит";
  $("modeHint").textContent=r==="mia"?"обращение к Мие → отвечает Мия":r==="edith"?"обращение к Эдит → отвечает Эдит":"без обращения по имени → отвечают обе";
}
function renderStats(){
  const a=mia.stats(),b=edith.stats(),s=shared.stats();
  $("miaStats").textContent=`${a.facts} знаний · ${a.concepts} понятий · ${a.episodes} эпизодов`;
  $("edithStats").textContent=`${b.facts} знаний · ${b.concepts} понятий · ${b.episodes} эпизодов`;
  $("sharedStats").textContent=`${s.facts} общих знаний · ${s.cycles} циклов`;
  $("systemState").innerHTML=`<span class="ok">● локальное ядро работает</span><br>Мия: память ${a.facts}, связи ${a.relations}<br>Эдит: память ${b.facts}, связи ${b.relations}<br>Общая память: ${s.facts}`;
}
async function send(text){
  text=text.trim();if(!text)return;
  updateMode(recipient(text));add("user",text);
  mia.learn(text);edith.learn(text);shared.fact(text,"conversation",.4);
  context.push("user",text);
  $("thinking").classList.add("on");
  await new Promise(r=>setTimeout(r,250));
  const r=recipient(text);
  if(r==="mia"){
    const x=mia.respond(text,context.recent());add("mia",x.answer);context.push("mia",x.answer);
  }else if(r==="edith"){
    const x=edith.respond(text,context.recent());add("edith",x.answer);context.push("edith",x.answer);
  }else{
    const x=mia.respond(text,context.recent());add("mia",x.answer);context.push("mia",x.answer);
    await new Promise(r=>setTimeout(r,350));
    const y=edith.respond(text,context.recent());add("edith",y.answer);context.push("edith",y.answer);
  }
  $("thinking").classList.remove("on");renderStats();
}
$("send").onclick=()=>{send($("input").value);$("input").value=""};
$("input").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();$("send").click()}};
document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>send(b.dataset.q));
$("teach").onclick=()=>{
  const x=prompt("Чему научить оба мозга?");
  if(!x)return;
  mia.learn("Запомни: "+x);edith.learn("Запомни: "+x);shared.fact(x,"teaching",1);
  add("edith","Я сохранила новое знание.");
  add("mia","Я тоже запомнила ❤️");
  renderStats();
};
$("dialogue").onclick=async()=>{
  add("edith","Мия, поговорим. Тема: чему нам стоит научиться?");
  await talk(mia,edith,"Чему нам стоит научиться?",context.recent(),(who,text)=>{add(who,text);context.push(who,text)});
  renderStats();
};

if(history.length){
  for(const x of history){const el=document.createElement("div");el.className="msg "+x.role;const b=document.createElement("div");b.className="bubble";const w=document.createElement("span");w.className="who";w.textContent=x.role==="user"?"Ты":x.role==="mia"?"Мия · 6 лет":"Эдит · 30 лет";const body=document.createElement("span");body.textContent=x.text;b.append(w,body);el.append(b);messages.append(el)}
}else{
  add("mia","Привет, папа ❤️ Я Мия. У меня теперь отдельное когнитивное ядро.");
  add("edith","Привет. Я Эдит. У нас теперь не один HTML-файл, а настоящая модульная архитектура.");
}
renderStats();
