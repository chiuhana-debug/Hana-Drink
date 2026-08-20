# HANA DRINK · 花飲茶舍

> 現代極簡靜奢茶舍 · 東方工夫慢萃 · AI 智能侍茶師體驗  
> Modern Artisanal Tea House & AI Tea Sommelier Web Experience

---

## 🍵 Features (特色功能)

1. **旬味現萃茶品目錄 (Curated Tea Harvest & Rituals)**:
   - 單一產區莊園茶款、16小時低溫慢萃冷滴、京都宇治初摘手打抹茶、慢火炭焙厚乳茶。
   - 包含香氣前中後調光譜（花香、炭焙、果香、旨味甘甜）、烘焙度與咖啡因標示。
2. **觸感茶飲客製系統 (Tactile Drink Customizer)**:
   - 萃取溫度與冰度（0°C 慢萃冷滴至 85°C 現泡熱萃）、天然甜度梯度、小農莊園鮮乳與生椰乳、手作桂花茶凍與柚香寒天等配料。
3. **AI 智能侍茶師尋味 Agent (Hana AI Tea Sommelier)**:
   - 整合 Google Gemini 3.7 智能模型與品牌專屬茶單知識庫。
   - 根據客人的心情、口感偏好、時刻或搭配點心，即時提供專屬茶款推薦、風味賞析與侍茶師客製黃金比例。
   - 具備離線/靜態智慧尋味引擎（支援純靜態 GitHub Pages 託管無縫運作）。
4. **訂單袋與預約席位 (Bag Drawer & Tasting Lounge)**:
   - 隨身訂單袋、外帶/冷鏈配送選項、手寫書法卡片備註與大安旗艦席位預約。

---

## 🚀 Quick Start (本機開發與運行)

### 1. 安裝相依套件
```bash
npm install
```

### 2. 設定環境變數 (選用)
複製 `.env.example` 為 `.env` 並填入您的 Gemini API Key（如未設定，系統會自動切換為高保真智能侍茶知識庫模式）：
```bash
cp .env.example .env
```
在 `.env` 中加入：
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 啟動開發伺服器
```bash
npm run dev
```
開啟瀏覽器至 `http://localhost:3000` 即可預覽。

---

## 📦 Build & Production (建置與生產環境)

### 完整建置 (前端 + Node.js 伺服器)
```bash
npm run build
```

### 啟動生產伺服器
```bash
npm run start
```

---

## 🌐 Deploy to GitHub & GitHub Pages (部署至 GitHub Pages)

本專案已完成 GitHub Pages 的靜態路徑配置（`base: './'`）與 GitHub Actions 自動建置工作流程（`.github/workflows/deploy.yml`）。

### 步驟 1：初始化 Git 並同步至您的 GitHub 儲存庫
```bash
# 初始化 Git
git init

# 加入所有專案檔案
git add .

# 提交變更
git commit -m "feat: complete Hana Drink app with AI Sommelier & GitHub Pages workflow"

# 設定主分支
git branch -M main

# 關聯您的 GitHub 遠端倉庫（請替換為您的倉庫網址）
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 推送程式碼
git push -u origin main
```

### 步驟 2：在 GitHub 啟用 Pages 部署
1. 前往您的 GitHub 專案頁面，點擊 **Settings**（設定）。
2. 在左側選單點擊 **Pages**。
3. 在 **Build and deployment** 下方的 **Source** 選擇 **GitHub Actions**。
4. 每次您推送程式碼至 `main` 分支，GitHub Actions 將會自動編譯並部署至 GitHub Pages！

---

## 🛠️ Tech Stack (技術棧)
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Design System**: Quiet Luxury Editorial Aesthetic, Playfair Display & Montserrat typography
- **Icons**: Lucide React
- **Backend / AI**: Node.js Express, Google GenAI SDK (`@google/genai` - Gemini 3.7 / 2.5 Flash), esbuild
