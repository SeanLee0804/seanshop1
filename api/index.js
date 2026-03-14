const { OAuth2Client } = require('google-auth-library');

// 這是你的專屬通行證
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
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: MY_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userEmail = payload.email.toLowerCase();
        
        if (userEmail === ADMIN_EMAIL) {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            return res.status(403).json({ error: `拒絕存取：${userEmail} 不在名單中` });
        }
    } catch (error) {
        return res.status(500).json({ error: `驗證失敗: ${error.message}` });
    }
};
