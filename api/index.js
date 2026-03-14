const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('446221628195-8b1qsqhgv065p17fl115tupc9lob730pq.apps.googleusercontent.com');
const ADMIN_EMAIL = '034sean0804@gmail.com';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        try {
            const response = await fetch(`${process.env.STORAGE_REST_API_URL}/get/products`, {
                headers: { Authorization: `Bearer ${process.env.STORAGE_REST_API_TOKEN}` }
            });
            const data = await response.json();
            return res.status(200).json({ products: data.result ? JSON.parse(data.result) : null });
        } catch (e) {
            return res.status(200).json({ products: null });
        }
    }

    try {
        const { token, action, newData } = req.body;
        const ticket = await client.verifyIdToken({ idToken: token, audience: '446221628195-8b1qsqhgv065p17fl115tupc9lob730pq.apps.googleusercontent.com' });
        const payload = ticket.getPayload();
        if (payload.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return res.status(403).json({ error: "No admin" });

        if (action === 'save' && newData) {
            await fetch(`${process.env.STORAGE_REST_API_URL}/set/products`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${process.env.STORAGE_REST_API_TOKEN}` },
                body: JSON.stringify(JSON.stringify(newData))
            });
            return res.status(200).json({ success: true });
        }
        return res.status(200).json({ name: payload.name, success: true });
    } catch (e) {
        return res.status(401).json({ error: "Auth failed" });
    }
};
