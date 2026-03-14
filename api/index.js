const { OAuth2Client } = require('google-auth-library');

// 這是你的 Client ID，請確保前後沒有空格
const CLIENT_ID = '446221628195-8b1qsqhgv065p17f115topc9iob730pq.apps.googleusercontent.com';
const ADMIN_EMAIL = '034sean0804@gmail.com';

const client = new OAuth2Client(CLIENT_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { token } = req.body;
        if (!token) throw new Error("No token provided");

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        // 強制小寫比對
        if (payload.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            return res.status(403).json({ error: `身分不符：${payload.email}` });
        }
    } catch (e) {
        // 這行最重要，它會把錯誤訊息噴給前端的 Response
        return res.status(401).json({ error: e.message });
    }
};
