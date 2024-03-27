const express = require('express');
const Redis = require('redis');
const bodyParser = require('body-parser');
const cors = require('cors');
const {addOrder, getOrder} = require("./services/orderservice.js");
const {addOrderItem, getOrderItem } = require("./services/orderItemservice.js");
const fs = require("fs");
const Schema = JSON.parse(fs.readFileSync("./orderItemSchema.json"));
const Ajv = require('ajv');
const { error } = require('console');
const ajv = new Ajv();


const options = {
    origin:'http://localhost:3000'//allow our frontend to call this backend
}

//import express from 'express';
const redisClient = Redis.createClient({
    url:`redis://localhost:6379`
});

const app = express();//create an express application
const port =3001;//this is the port number

app.use(bodyParser.json());
app.use(cors(options));//allow frontend to call backend

app.listen(port,()=>{
    redisClient.connect();//this connects to the redis database!!!!!!
    console.log(`API is Listening on port: ${port}`);//template literal
});//listen for web requests from the frontend and don't stop

//http://localhost:3000/boxes

app.post('/boxes', async (req,res)=>{//async means we will await promises
    const newBox = req.body;//now we have a box
    newBox.id= parseInt(await redisClient.json.arrLen('boxes','$'))+1;//the user shouldn't choose the ID
    await redisClient.json.arrAppend('boxes','$',newBox);//saves the JSON in redis
    res.json(newBox);//respond with the new box
});

app.post("/orders", async (req,res)=>{
    let order = req.body;
    let responseStatus = order.productQuantity
    ? 200
    : 400 && order.shippingAddress
    ? 200
    : 400;

if (responseStatus ===200){
    try{
        await addOrder({redisClient, order});
    } catch (error){
        console.error(error);
        responseStatus.status(500).send("Internal Server Error");
        return;
    }
} else{
    res.status(responseStatus);
    res.send(
        `Missing one of the following fields: ${exactMatchOrderFields()} ${partiallyMatchOrderFields()}`
    )
}
    res.status(responseStatus).send();

});

app.get("/orders/:orderId", async (req,res)=>{
    //get the order from the database
    const orderId = req.params.orderId;
    let order = await getOrder({redisClient, orderId});
    res.json(order)
}
)

app.post("/orderItems", async (req,res)=>{
    try{
        console.log("Schema:",Schema);
        const validate = ajv.compile(Schema);
        const valid = validate(req.body);
        if(!valid){
            return res.status(400).json({error: "Invalid request body"});
        }
        console.log("Request Body:",req.body);
        const orderItemId = await addOrderItem({redisClient, orderItem: req.body});

        res.status(201).json({orderItemId, message: "Order item added successfully"});
    } catch(error){
        console.error("Error adding order item:",error);
        res.status(500).json({error: "Internal Server Error"});
    }

}
);

// 1- URL
// 2- a function to return boxes
// req= the request from the browser
// res= the response to the browser
app.get('/boxes',async (req,res)=>{
    const url = req.url;
    console.log(`URL : ${url}`);
    let boxes = await redisClient.json.get('boxes',{path:'$'});//get the boxes
    //send the boxes to the browser
    res.json(boxes[0]);//the boxes is an array of arrays, convert first element to a JSON string
});//return boxes to the user

console.log("Hello");