import express from "express"
import { search } from "../controller/search.js"
const router = express.Router()

router.get("/search",search)

export default router;