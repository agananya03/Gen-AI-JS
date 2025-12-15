import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from 'js-tiktoken/ranks/o200k_base';

const enc = new Tiktoken(o200k_base);
const userQuery = 'Hey there, I am Ananya Garg';
const tokens = enc.encode(userQuery);
console.log({tokens});