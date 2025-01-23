import { db } from "../db.js";

export const addLev = (req, res) => {
    // ดึงค่าจาก body ของ request
    const { full_name, department_position, email, tel, leave_type, leave_reason, leave_start, leave_end } = req.body;

    // ตรวจสอบว่ามีค่า leave_start และ leave_end หรือไม่
    if (!leave_start || !leave_end) {
        return res.status(400).json({ message: 'กรุณาระบุวันเริ่มต้นและวันสิ้นสุด' });
    }

    // แปลงวันที่จาก string เป็น Date
    const today = new Date();
    const start_day = new Date(leave_start);
    const end_day = new Date(leave_end);

    // ตรวจสอบว่ารูปแบบวันที่ถูกต้องหรือไม่
    if (isNaN(start_day) || isNaN(end_day)) {
        return res.status(400).json({ message: 'รูปแบบวันที่ไม่ถูกต้อง' });
    }

    // ตรวจสอบเงื่อนไขวันที่
    if (start_day < today) {

        return res.status(400).json({ message: 'ไม่อนุญาตให้ลาย้อนหลัง' });
    }

    // พักร้อนต้องล่วงหน้าอย่างน้อย 3 วัน
    const daysBeforeStart = (start_day - today) / (1000 * 60 * 60 * 24);
    if (leave_type === 'พักร้อน' && daysBeforeStart < 3) {
        return res.status(400).json({ message: 'พักร้อนต้องล่วงหน้าอย่างน้อย 3 วัน' });
    }

    // พักร้อนต้องไม่เกิน 2 วัน
    const leaveDuration = (end_day - start_day) / (1000 * 60 * 60 * 24);
    if (leave_type === 'พักร้อน' && leaveDuration > 2) {
        return res.status(400).json({ message: 'พักร้อนต้องไม่เกิน 2 วัน' });
    }

    // คำสั่ง SQL สำหรับเพิ่มข้อมูล
    const q = `
        INSERT INTO leave_requests 
        (full_name, department_position, email, tel, leave_type, leave_reason, leave_start, leave_end) 
        VALUES (?)
    `;

    const values = [full_name, department_position, email, tel, leave_type, leave_reason, leave_start, leave_end];

    // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
    try {
        db.query(q, [values], (err, data) => {
            if (err) {
                console.error('ข้อผิดพลาดในการเพิ่มคำขอลางาน:', err);
                return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มคำขอลางาน' });
            }
            return res.status(200).json({ message: 'เพิ่มคำขอลางานสำเร็จ', leaveId: data.insertId });
        });
    } catch (error) {
        console.error('ข้อผิดพลาดที่ไม่ได้คาดคิด:', error);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดที่ไม่ได้คาดคิด' });
    }
};


export const Delete = (req,res) =>{
    
}

export const changeStatus = (req,res) =>{

}