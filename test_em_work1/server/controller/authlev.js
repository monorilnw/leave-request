import { db } from "../db.js";

export const addLev = (req, res) => {
    // ดึงค่าจาก body ของ request
    const { full_name, department_position, email, tel, leave_type, leave_reason, leave_start, leave_end ,other_leave_type } = req.body;

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
        (full_name, department_position, email, tel, leave_type, leave_reason, leave_start, leave_end,other_leave_type ) 
        VALUES (?)
    `;

    const values = [full_name, department_position, email, tel, leave_type, leave_reason, leave_start, leave_end,other_leave_type ];

    // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
    try {
        db.query(q, [values], (err, data) => {
            if (err) {
                console.error('ข้อผิดพลาดในการเพิ่มคำขอลางาน:', data);
                return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มคำขอลางาน' ,details: err });
            }
            return res.status(200).json({ message: 'เพิ่มคำขอลางานสำเร็จ', leaveId: data.insertId });
        });
    } catch (error) {

        console.error('ข้อผิดพลาดที่ไม่ได้คาดคิด:', error);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดที่ไม่ได้คาดคิด',details: err });
        
    }
    
};


export const Delete = (req,res) =>{
    const { id } = req.params;
    const q = `DELETE FROM leave_requests WHERE id = ?`;
    db.query(q, [id], (err, data) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', err);
            return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
        }
        return res.status(200).json({ message: 'ลบข้อมูลสำเร็จ' });
    });
}

export const changeStatus = (req,res) =>{
    const { id } = req.params;
    const { status } = req.body;

    if (!["อนุมัติ", "ไม่อนุมัติ"].includes(status)) {
        return res.status(400).json({ message: "สถานะไม่ถูกต้อง" });
    }

    db.query("UPDATE leave_requests SET status = ? WHERE id = ? AND status = 'รอพิจารณา'", [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "ไม่สามารถเปลี่ยนสถานะได้" });
        }
        res.json({ message: "อัปเดตสถานะสำเร็จ" });
    });
}