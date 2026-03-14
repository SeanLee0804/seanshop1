const { OAuth2Client } = require('google-auth-library');

// 你的 Client ID 和管理員信箱
const CLIENT_ID = '446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com';
const ADMIN_EMAIL = '034sean0804@gmail.com';

const client = new OAuth2Client(CLIENT_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(200).send("API 已就緒，等待老闆登入！");
    }

    try {
        const { token } = req.body;
        // 使用更彈性的驗證方式
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        
        // 取得 Google 回傳的真實 Email
        const googleEmail = payload.email.toLowerCase();
        
        if (googleEmail === ADMIN_EMAIL.toLowerCase()) {
            return res.status(200).json({ 
                name: payload.name, 
                success: true 
            });
        } else {
            return res.status(403).json({ 
                error: `驗證失敗：你目前的 Google 帳號是 [${googleEmail}]，並非管理員。` 
            });
        }
    } catch (e) {
        return res.status(401).json({ error: "驗證發生錯誤，可能是 Client ID 設定有誤" });
    }
};
