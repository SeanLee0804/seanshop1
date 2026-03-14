module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 這裡完全不做任何 Google 驗證，直接放行
    return res.status(200).json({ 
        name: "強制登入測試", 
        success: true,
        message: "如果你看到這行，代表 API 終於更新了！"
    });
};
