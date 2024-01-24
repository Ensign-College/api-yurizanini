//import { Express } from "express";
const express = require('express');//express makes APIs - connect frontend to database
const Redis = require('redis');//import the Redis class from the library
const bodyParser = require('body-parser');

const redisClient = Redis.createClient({
    url:`redis://localhost:6379`
});

const app = express();//create an express application
const port = 3000;

// Middleware to parse JSON body in requests
//app.use(express.json());
app.use(bodyParser.json());

app.listen(port,()=>{
    redisClient.connect();//this connects to the redis ddatabase!!!!
    console.log(`API is listening on port: ${port} - http://localhost:3000/boxes2`);//template literal
});//listen for web requests from the frontend and don't stop

// 1 - URL
// 2 - a function to return boxes2
// req - the reuest from the browser
// res - the response to the browser
app.get('/boxes2', async (req,res)=>{
    let boxes2 = await redisClient.json.get('boxes2',{path:'$'});//get boxes2
    //send boxes2 to the browser
    res.json(boxes2);//convert the boxes2 to a string
});//return boxes2 to the user

// app.post('/boxes2', async (req,res)=>{
//     const newBox = req.body; // Get the new box details from the request body

//     let boxes2 = await redisClient.json.arrAppend('boxes2', { path: '$' });


//     if (!boxes2) {
//         boxes2 = []; // Initialize as an empty array if it doesn't exist
//     }

//     boxes2.push(newBox);

//     await redisClient.json.set('boxes2', '.', boxes2);
//     res.status(201).send('Box created successfully');
// });

app.post('/boxes2', async (req,res)=>{
    const newBox = req.body; // Get the new box details from the request body
    newBox.id = parseInt(await redisClient.json.arrLen('boxes2', '$')) + 1;//the user shoulddn't be allowed to choose the ID
    await redisClient.json.arrAppend('boxes2', '$', newBox);//saves the JSON in redis.

    res.json(newBox);//responde with the new box
});

console.log("Hello");