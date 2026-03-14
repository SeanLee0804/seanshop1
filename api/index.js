const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com');

module.exports = async (req, res) => {
  // 基礎設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  // 測試用：直接打開網址時顯示
  if (req.method !== 'POST') {
    return res.status(200).send("✅ API 已連線，套件加載成功！");
  }

  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '446221628195-8b1uquhgku05p17fl115tupc9lob730q.apps.googleusercontent.com'
    });
    const payload = ticket.getPayload();
    
    if (payload.email === '034sean0804@gmail.com') {
      return res.status(200).json({ name: payload.name, success: true });
    } else {
      return res.status(403).json({ error: "老闆，這帳號不對喔！" });
    }
  } catch (e) {
    return res.status(401).json({ error: "驗證發生錯誤，請重新登入。" });
  }
};
