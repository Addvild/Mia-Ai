import {Brain} from "../brain.js";
export function createMia(shared){
  return new Brain({name:"Мия",age:6,key:"mia_brain_v2",style:"child",shared});
}
