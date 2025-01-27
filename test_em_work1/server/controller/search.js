import { db } from "../db.js";

export const search =  (req, res) => {
    const {search,sort} = req.query;

    try {
        let query = `SELECT * FROM leave_requests `;
        const values = [];
        if(search){
            query += `WHERE full_name LIKE ? OR start_date = ?"`;
            values.push(`%${search}%`,search);
        }
        if(sort){
            query += `ORDER BY ${sort} `;
        }
        const [row] = db.query(query, values);
        res.status(200).json(row);
    }catch (error) {
        console.error('ข้อผิดพลาดที่ไม่ได้คาดคิด:', error);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดที่ไม่ได้คาดคิด' });
    }
}