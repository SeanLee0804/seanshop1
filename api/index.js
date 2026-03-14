const { OAuth2Client } = require('google-auth-library');

// 直接寫死，不跳轉環境變數，確保 100% 抓到
const ADMIN_EMAIL = '034sean0804@gmail.com'; 
const MY_CLIENT_ID = '446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com';

const client = new OAuth2Client(MY_CLIENT_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: MY_CLIENT_ID
        });
        const payload = ticket.getPayload();
        
        if (payload.email === ADMIN_EMAIL) {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            return res.status(403).json({ error: `拒絕存取：${payload.email} 不在管理員名單中` });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '驗證伺服器錯誤' });
    }
};
