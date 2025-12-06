import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import { generate } from './chatBot.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Chat Llama server working');

});

app.post('/chat',async (req,res)=>{
    const {message,threadId}=req.body;
    console.log("Message",message);
    // Validation
    if(!message || !threadId){
        return res.status(400).json({message:'All fields all required'});
    }
        
   const result= await generate(message,threadId);
    console.log(result);
        
    res.json({response:result});    
});

app.listen(PORT,()=>{
    console.log(`Server is listening on port: ${PORT}`);
    
});





