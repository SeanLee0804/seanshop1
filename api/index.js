const { OAuth2Client } = require('google-auth-library');

const ADMIN_EMAIL = '034sean0804@gmail.com'; 
const MY_CLIENT_ID = '446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com';

const client = new OAuth2Client(MY_CLIENT_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: MY_CLIENT_ID
        });
        const payload = ticket.getPayload();
        
        // 【核心除錯】如果信箱不對，直接把收到的信箱顯示在錯誤訊息裡
        if (payload.email === ADMIN_EMAIL) {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            return res.status(403).json({ 
                error: `驗證失敗！你登入的是：[${payload.email}]，但管理員設定為：[${ADMIN_EMAIL}]` 
            });
        }
    } catch (error) {
        return res.status(500).json({ error: `伺服器錯誤: ${error.message}` });
    }
};
