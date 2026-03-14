const { OAuth2Client } = require('google-auth-library');

const ADMIN_EMAIL = '034sean0804@gmail.com'.toLowerCase(); // 強制轉小寫
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
        const userEmail = payload.email.toLowerCase(); // 把收到的 Email 也轉小寫
        
        // 忽略大小寫的比對
        if (userEmail === ADMIN_EMAIL) {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            return res.status(403).json({ 
                error: `驗證失敗！\n你登入的是：${userEmail}\n管理員設定為：${ADMIN_EMAIL}` 
            });
        }
    } catch (error) {
        return res.status(500).json({ error: `伺服器錯誤: ${error.message}` });
    }
};
