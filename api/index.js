const { OAuth2Client } = require('google-auth-library');
// 直接在這裡設定管理員 Email，不依賴環境變數
const ADMIN_EMAIL = '034sean0804@gmail.com'; 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = async (req, res) => {
    // 解決跨域問題
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        
        // 這裡會直接比對你的信箱
        if (payload.email === ADMIN_EMAIL) {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            // 如果還是失敗，讓它回傳我們收到的 Email 是什麼，方便除錯
            return res.status(403).json({ error: `拒絕存取：${payload.email} 不在管理員名單中` });
        }
    } catch (error) {
        return res.status(500).json({ error: '驗證伺服器錯誤' });
    }
};
