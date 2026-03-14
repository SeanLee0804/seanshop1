const { OAuth2Client } = require('google-auth-library');

// 1. 確保這兩個字串前後完全沒有空格
const ADMIN_EMAIL = '034sean0804@gmail.com'.toLowerCase(); 
const MY_CLIENT_ID = '446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com';

const client = new OAuth2Client(MY_CLIENT_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: '缺少 Token' });

        // 嘗試驗證
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: MY_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const userEmail = payload.email.toLowerCase();
        
        if (userEmail === ADMIN_EMAIL) {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            // 如果 Email 不對，報錯
            return res.status(403).json({ error: `身分不符！你登入的是 ${userEmail}` });
        }
    } catch (error) {
        // 【關鍵診斷】如果 Google 驗證失敗，噴出詳細原因
        return res.status(401).json({ 
            error: `Google 驗證失敗: ${error.message}`,
            hint: "請檢查 Google Cloud 的 Client ID 是否與代碼一致"
        });
    }
};
