import express from "express";
import Lev from "./routers/authlev.js";
import search from "./routers/search.js";
import cors from "cors";

const app = express()


app.use(cors()); 
app.use(express.json())
app.use("/server/add",Lev)
app.get("/server/search", search); // Ensure this is correct


app.listen(8000,()=>{
    console.log("Connected!")
})