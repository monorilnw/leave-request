import express from "express";
import Lev from "./routers/authlev.js";
import test from "./routers/search.js";
const app = express()

app.use(express.json())
app.use("/server",Lev)
app.use("/server",test)

app.listen(8000,()=>{
    console.log("Connected!")
})