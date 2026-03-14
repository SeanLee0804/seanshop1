module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send("API 測試：如果你看到這行，代表伺服器沒壞，是套件裝壞了！");
};
