export async function talk(mia,edith,topic,context,emit){
  const a=edith.respond(topic,context);
  emit("edith",a.answer);
  await new Promise(r=>setTimeout(r,350));
  const b=mia.respond("Эдит сказала: "+a.answer,context);
  emit("mia",b.answer);
  await new Promise(r=>setTimeout(r,350));
  const c=edith.respond("Мия сказала: "+b.answer,context);
  emit("edith",c.answer);
}
