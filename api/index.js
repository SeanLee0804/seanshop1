// 1. 這是你的初始商品資料（當雲端是空的時候用）
let steamData = [
    { name: "Steam 蒸氣卡 500 TWD", price: 550, stock: 10 },
    // ... 其他預設資料
];

// 2. 網頁一打開，立刻執行這件事
async function initStore() {
    console.log("正在從雲端保險箱拿取最新價格...");
    try {
        const res = await fetch('/api');
        const data = await res.json();
        
        if (data.products) {
            console.log("✅ 成功拿到雲端資料！");
            steamData = data.products; // 把雲端的資料蓋掉預設資料
        } else {
            console.log("ℹ️ 雲端目前是空的，使用預設價格。");
        }
    } catch (e) {
        console.error("❌ 讀取雲端失敗，使用本地備份。");
    }
    renderProducts(); // 呼叫你原本畫出商品的函數
}

// 3. 【老闆專用】按下「一件保存」的超能力
async function saveToCloud() {
    // 檢查有沒有登入
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
        alert("請先點擊鑰匙登入管理員！");
        return;
    }

    const token = authInstance.currentUser.get().getAuthResponse().id_token;
    
    // 顯示讀取中，增加專業感
    const saveBtn = document.getElementById('save-btn');
    if(saveBtn) saveBtn.innerText = "同步中...";

    try {
        const res = await fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                action: 'save',
                newData: steamData // 把你現在畫面上改好的資料傳上去
            })
        });

        if (res.ok) {
            alert("✅ 雲端同步成功！以後不管是誰打開網頁，看到的都是這個價格。");
        } else {
            alert("❌ 保存失敗，權限不足或連線中斷。");
        }
    } catch (e) {
        alert("❌ 系統錯誤，請檢查 Vercel 環境變數。");
    } finally {
        if(saveBtn) saveBtn.innerText = "一件保存";
    }
}

// 記得在網頁載入完成後執行 initStore()
window.onload = initStore;
