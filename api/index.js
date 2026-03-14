const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com');

module.exports = async (req, res) => {
    // 1. 強制設定 Header
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 2. 處理預檢請求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. 測試入口 (直接瀏覽網址時)
    if (req.method !== 'POST') {
        return res.status(200).send("✅ API 正常運作中，等待 POST 登入請求。");
    }

    // 4. 正式驗證邏輯
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: "Missing Token" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com'
        });
        const payload = ticket.getPayload();
        
        // 5. 這裡嚴格比對老闆信箱
        if (payload && payload.email === '034sean0804@gmail.com') {
            return res.status(200).json({ name: payload.name, success: true });
        } else {
            return res.status(403).json({ error: "Unauthorized" });
        }
    } catch (e) {
        // 即使出錯也回傳 JSON，不要讓伺服器噴 500
        return res.status(401).json({ error: "Auth Failed", details: e.message });
    }
};
