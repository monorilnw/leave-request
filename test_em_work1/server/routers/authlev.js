import express from "express";
import { addLev, changeStatus, Delete } from "../controller/authlev.js";

const router = express.Router();

// ใช้ method ที่เหมาะสม
router.post("/add", addLev); // สำหรับเพิ่มคำขอลา
router.delete("/delete/:id", Delete); // สำหรับลบคำขอลา
router.patch("/status/:id", changeStatus); // สำหรับอัปเดตสถานะคำขอลา

export default router;
