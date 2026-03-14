const { OAuth2Client } = require('google-auth-library');

// 確保這裡是老闆的最愛帳號
const ADMIN_EMAIL = '034sean0804@gmail.com'; 
const MY_CLIENT_ID = '446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com';

const client = new OAuth2Client(MY_CLIENT_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(200).send("API Online - 準備接受登入");
    }

    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: MY_CLIENT_ID
        });
        const payload = ticket.getPayload();
        
        // 【核心修正】強制轉成小寫比對，避免大小寫不一致
        const userEmail = payload.email.toLowerCase().trim();
        const adminEmail = ADMIN_EMAIL.toLowerCase().trim();
        
        if (userEmail === adminEmail) {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            // 如果失敗，直接讓前端彈窗告訴你到底偵測到哪個 Email
            return res.status(403).json({ error: `拒絕存取：偵測到的 Email 是 [${userEmail}]` });
        }
    } catch (e) {
        return res.status(401).json({ error: "Google 驗證失敗，請重試" });
    }
};
