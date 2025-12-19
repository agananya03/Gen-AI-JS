import Groq from "groq-sdk";
import 'dotenv/config'
import axios from "axios";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function getweatherDetailsbyCity(cityname = '') {
    const url = `https://wttr.in/${cityname.toLowerCase()}?format=%C+%t`
    const {data} = await axios.get(url, { responseType: 'text'});
    return `The current weather of ${cityname} is ${data}`
}

getweatherDetailsbyCity('Delhi').then(console.log);
async function main(){

}