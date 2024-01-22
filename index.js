//import { Express } from "express";
const express = require('express');//express makes APIs - connect frontend to database
const Redis = require('redis');//import the Redis class from the library

const redisClient = Redis.createClient({
    url:`redis://localhost:6379`
});

const app = express();//create an express application
const port = 3000;
app.listen(port,()=>{
    redisClient.connect();//this connects to the redis ddatabase!!!!
    console.log(`API is listening on port: ${port} - http://localhost:3000/boxes`);//template literal
});//listen for web requests from the frontend and don't stop

// 1 - URL
// 2 - a function to return boxes
// req - the reuest from the browser
// res - the response to the browser
app.get('/boxes', async (req,res)=>{
    let boxes = await redisClient.json.get('boxes',{path:'$'});//get boxes
    //send boxes to the browser
    res.send(JSON.stringify(boxes));//convert the boxes to a string
});//return boxes to the user

console.log("Hello");