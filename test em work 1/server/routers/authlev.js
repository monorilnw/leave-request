import express from "express"
import { addLev, changeStatus, Delete } from "../controller/authlev.js";

const router = express.Router()

router.get("/addlev",addLev)
router.get("/Delete",Delete)
router.get("/changeStatus",changeStatus)

export default router;