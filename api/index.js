const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // 這裡填入你的 Gmail
    if (payload.email === process.env.ADMIN_EMAIL) {
      res.json({ success: true, name: payload.name });
    } else {
      res.status(403).send('權限不足');
    }
  } catch (error) {
    res.status(400).send('驗證失敗');
  }
};
