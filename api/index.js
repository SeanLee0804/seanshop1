const { OAuth2Client } = require('google-auth-library');

// 檢查你的 ID 是否有複製完整
const MY_CLIENT_ID = '446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com';
const ADMIN_EMAIL = '034sean0804@gmail.com';

const client = new OAuth2Client(MY_CLIENT_ID);

module.exports = async (req, res) => {
    // 跨域設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // 如果直接用網頁打開 /api，會走這裡，不會當機
        if (req.method !== 'POST') {
            return res.status(200).json({ status: "API 運作中", mode: "正式驗證版" });
        }

        const { token } = req.body;
        if (!token) return res.status(400).json({ error: '缺少 Token' });

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: MY_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const userEmail = payload.email.toLowerCase();
        
        if (userEmail === ADMIN_EMAIL.toLowerCase()) {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            return res.status(403).json({ error: `拒絕存取：${userEmail}` });
        }
    } catch (error) {
        // 把錯誤印出來，避免 500 錯誤
        return res.status(401).json({ error: `驗證失敗: ${error.message}` });
    }
};
