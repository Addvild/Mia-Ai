export class Context{
  constructor(limit=12){this.limit=limit;this.items=[]}
  push(role,text){this.items.push({role,text});this.items=this.items.slice(-this.limit)}
  recent(){return [...this.items]}
  clear(){this.items=[]}
}
