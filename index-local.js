const express = require("express");
const Redis = require("redis");
const bodyParser = require("body-parser");
const cors = require("cors");
const { addOrder, getOrder } = require("./services/orderservice.js");
const { addOrderItem, getOrderItem } = require("./services/orderItems.js");
const fs = require("fs");
const Schema = JSON.parse(fs.readFileSync("./orderItemSchema.json", "utf8"));
const Ajv = require("ajv");
const ajv = new Ajv();
const awsServerlessExpress = require('aws-serverless-express');

// Setup
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Redis client setup
const redisClient = Redis.createClient({
  url: `redis://localhost:6379`,
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Define routes as usual
app.post("/orders", async (req, res) => { /* ... */ });
app.get("/orders/:orderId", async (req, res) => { /* ... */ });
app.post("/orderItems", async (req, res) => { /* ... */ });
app.get("/orderItems/:orderItemId", async (req, res) => { /* ... */ });

// No need to listen on a port, AWS Lambda will handle incoming requests
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};