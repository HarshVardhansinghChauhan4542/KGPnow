import app from "./app.js";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}); 

mongoose.connect(process.env.MONGO_URI)
 .then(() =>{
    console.log('Connected to MongoDB');
 })
 .catch((err) =>{
    console.log(err);
 })
