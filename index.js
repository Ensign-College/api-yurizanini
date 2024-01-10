//import { Express } from "express";
const express = require('express');//express makes APIs - connect frontend to database

const app = express();//create an express application

app.listen(3000);//listen for web requests from the frontend and don't stop

const boxes = [
    {
        boxID: 1,
    },
    {
        boxID: 2,
    },
    {
        boxID: 3,
    },
    {
        boxID: 4,
    }

];

// 1 - URL
// 2 - a function to return boxes
// req - the reuest from the browser
// res - the response to the browser
app.get('/boxes', (req,res)=>{
    //send boxes to the browser
    res.send(JSON.stringify(boxes));//convert the boxes to a string
});//return boxes to the user

console.log("Hello");