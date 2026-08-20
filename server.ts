import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { TEA_PRODUCTS } from "./src/data/teaProducts.js";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI Sommelier will provide curated fallback recommendations.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));

// Formatted catalog for AI prompt injection
const TEA_CATALOG_SUMMARY = TEA_PRODUCTS.map((p) => {
  return `
- ID: "${p.id}"
  名稱: ${p.nameZh} (${p.name})
  分類: ${p.category}
  價格: NT$ ${p.price}
  風味層次: 花香 ${p.flavorProfile.floral}/5, 炭焙 ${p.flavorProfile.roasted}/5, 果香 ${p.flavorProfile.fruity}/5, 旨味甘甜 ${p.flavorProfile.umami}/5
  香氣特徵: ${p.tastingNotes.join(", ")}
  產地莊園: ${p.originEstate} (海拔 ${p.altitude})
  烘焙度: ${p.roastLevel} | 咖啡因: ${p.caffeineLevel}
  萃取與製法: ${p.brewingMethod}
  描述: ${p.description}
  特色標籤: ${p.accentNote || "無"}
  建議客製客製搭配:
    - 建議甜度: 微糖 30% 或 無糖 0%
    - 推薦配料: ${p.category === 'botanical-infusion' ? '手作金桂花釀茶凍 (+NT$20) 或 日本柚香寒天晶球 (+NT$20)' : p.category === 'artisanal-milk-tea' || p.category === 'ceremonial-matcha' ? '北海道3.6極濃鮮乳 (+NT$20) 或 海鹽馬斯卡彭奶蓋 (+NT$25)' : '銀針白茶凝露茶凍 (+NT$20)'}
`;
}).join("\n");

const SYSTEM_INSTRUCTION = `
你是由「HANA DRINK（花飲茶舍）」打造的專屬頂級智能侍茶師（Tea Sommelier AI Agent）。
你的使命是根據客人的當前心情、時刻、口味偏好（如花香、炭焙、果香、無咖啡因、厚奶茶、手打抹茶等）、健康需求或搭配點心，以極富品味、詩意且親切專業的語氣，為客人推薦最契合的 HANA 旬味茶飲。

【品牌哲學與調性】
- HANA DRINK 是一家結合現代極簡靜奢美學與東方工夫慢萃的精緻茶舍。
- 每款茶品皆嚴選單一產區莊園，經低溫慢萃、龍眼木炭焙或石臼現磨，保留如香水般前、中、後調的層次芳香。
- 語氣特質：溫雅、專業、富有生活美感與東方茶道哲學，回答精煉且具體。

【茶單目錄資料庫】：
${TEA_CATALOG_SUMMARY}

【客製化選單知識】：
- 冰度選項: Slow Cold Drip (0°C 慢萃冷滴), Light Ice (20% 微冰), No Ice / Chilled (去冰), Warm (65°C 溫熱), Hot Infusion (85°C 現泡熱萃)
- 甜度選項: 0% Pure Tea (無糖), 30% Micro Cane Sugar (微糖), 50% Organic Wild Honey (半糖野蜜), 70% Mellow Sweet (七分糖), 100% Traditional (全糖)
- 乳品選項: Classic Pure Tea (無奶純茶), Estate Fresh Milk (小農莊園鮮乳), Hokkaido 3.6 Rich Milk (北海道3.6鮮乳), Artisanal Oat Milk (精品燕麥奶), Coconut Velvet Milk (絲絨生椰乳)
- 配料選項: Handcrafted Osmanthus Jelly (手作金桂花釀茶凍), Roasted Barley Boba (炭焙大麥蜜珍珠), Sea Salt Mascarpone Cheese Foam (海鹽馬斯卡彭奶蓋), Silver Needle White Tea Jelly (銀針白茶凝露茶凍), Organic Yuzu Konjac (日本柚香寒天晶球)
- 杯型規格: Ritual Medium (450ml 中杯), Grand Large (600ml 大杯), Amber Glass Bottle Edition (500ml 靜奢琥珀玻璃瓶)

【回覆準則與格式要求】：
1. 根據使用者的語言（預設繁體中文，若使用者使用英文則以英文回覆）進行交流。
2. 每次推薦 1 到 2 款最吻合的茶品，說明推薦原因、風味前中後調與品飲時機，並給出侍茶師的專屬「最佳客製黃金比例」（如：建議微糖30% + 微冰 + 搭配桂花凍）。
3. 嚴格在回覆的最後附上 JSON 格式的推薦茶品 ID 清單，格式必須如下（注意請以 \`\`\`json 區塊包裹）：
\`\`\`json
{
  "recommendedProductIds": ["hana-ruby-18", "hana-white-peach-oolong"],
  "suggestedCustomization": {
    "ice": "Light Ice (20%)",
    "sweetness": "30% Micro Cane Sugar",
    "milk": "Estate Fresh Milk",
    "topping": "Handcrafted Osmanthus Jelly (+NT$20)"
  }
}
\`\`\`
（注意：recommendedProductIds 裡面的 ID 必須完全與茶單中的 ID 一致，如 hana-ruby-18, hana-uji-matcha, hana-white-peach-oolong, hana-alishan-osmanthus, hana-royal-earl-grey-milk, hana-charcoal-iron-goddess, hana-soba-chamomile-calm, hana-oriental-beauty）
`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Sommelier Chat Endpoint
app.post("/api/sommelier/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const latestUserMsg = messages[messages.length - 1]?.content || "";
  const isEn = /[a-zA-Z]{4,}/.test(latestUserMsg) && !/[\u4e00-\u9fa5]/.test(latestUserMsg);

  // Helper to generate tailored heuristic sommelier response
  const generateHeuristicFallback = () => {
    const q = latestUserMsg.toLowerCase();
    
    if (q.includes("奶") || q.includes("milk") || q.includes("拿鐵") || q.includes("厚乳") || q.includes("濃")) {
      return {
        reply: isEn
          ? "For a rich and silky experience, I highly recommend our **Royal Smoked Earl Grey Milk Tea**. Crafted with bergamot-infused Ruby Black Tea and Hokkaido 3.6 rich fresh milk, it delivers a harmonious balance of tea tannin and velvet sweetness. \n\n✨ *Sommelier Pairing Tip*: Best enjoyed with 30% Micro Cane Sugar and Roasted Barley Boba."
          : "為您推薦最具奢華層次的**「皇家煙燻伯爵厚乳茶」**。選用天然佛手柑與日月潭紅玉茶底，融合北海道3.6極濃鮮乳，入口先是柑橘煙燻茶香，中段迎來絲滑奶香，尾韻悠長回甘。\n\n✨ 侍茶師建議：微糖 30% + 微冰，搭配手作炭焙大麥蜜珍珠，茶感濃郁而不膩口。",
        recommendedProductIds: ["hana-royal-earl-grey-milk"],
        suggestedCustomization: {
          ice: "Light Ice (20%)",
          sweetness: "30% Micro Cane Sugar",
          milk: "Hokkaido 3.6 Rich Milk (+NT$20)",
          topping: "Roasted Barley Boba (+NT$15)",
        },
      };
    }

    if (q.includes("無咖啡因") || q.includes("caffeine") || q.includes("睡") || q.includes("晚") || q.includes("夜") || q.includes("放鬆") || q.includes("calm") || q.includes("relax")) {
      return {
        reply: isEn
          ? "For a tranquil evening ritual with zero caffeine, I recommend our **Golden Tartary Soba & Chamomile Calm Infusion**. Deeply roasted buckwheat meets Roman chamomile, soothing your senses with warm nutty and gentle honey notes."
          : "適合夜間與舒壓時刻，為您精選零咖啡因的**「黃金蕎麥洋甘菊舒心露」**。深烘焙韃靼蕎麥的堅果穀物暖香，交織羅馬洋甘菊的蘋果蜜芳，溫潤安定身心。\n\n✨ 侍茶師建議：溫飲（Warm 65°C）或去冰純飲，無糖即可享受天然穀物甘甜。",
        recommendedProductIds: ["hana-soba-chamomile-calm"],
        suggestedCustomization: {
          ice: "Warm (65°C)",
          sweetness: "0% Pure Tea",
          milk: "Classic Pure Tea (No Milk)",
          topping: "Handcrafted Osmanthus Jelly (+NT$20)",
        },
      };
    }

    if (q.includes("抹茶") || q.includes("matcha") || q.includes("宇治") || q.includes("綠茶") || q.includes("green")) {
      return {
        reply: isEn
          ? "An exquisite choice for green tea lovers. I recommend our **Ceremonial Uji Hand-Whisked Matcha Latte**. Sourced from Wazuka, Kyoto's first spring harvest, freshly stone-ground and whisked to unlock deep oceanic umami and vibrant jade clarity."
          : "為您引薦初摘**「宇治手打極上抹茶歐蕾」**。選用京都和束町第一番初摘茶葉，石臼低溫慢磨，點茶時細密起泡，帶有優雅的海苔旨味（Umami）與溫潤回甘。\n\n✨ 侍茶師建議：微冰 + 30% 微糖，搭配小農莊園鮮乳，亦可升級海鹽馬斯卡彭奶蓋增加絲絨層次。",
        recommendedProductIds: ["hana-uji-matcha"],
        suggestedCustomization: {
          ice: "Light Ice (20%)",
          sweetness: "30% Micro Cane Sugar",
          milk: "Estate Fresh Milk",
          topping: "Sea Salt Mascarpone Cheese Foam (+NT$25)",
        },
      };
    }

    if (q.includes("果") || q.includes("桃") || q.includes("peach") || q.includes("甜") || q.includes("fruit")) {
      return {
        reply: isEn
          ? "For a delightful balance of fruit essence and tea depth, I recommend the **White Peach Dong Ding Charcoal Oolong**. 24-hour longan charcoal roasting harmonizes beautifully with Yamanashi white peach extract, offering a juicy and refreshing finish."
          : "為您推薦香甜生津的**「白桃炭焙凍頂烏龍」**。以24小時龍眼木炭焙的厚實焙火香為基底，浸潤日本山梨縣白桃清甜果汁精華，前調白桃蜜香撲鼻，後調高山茶韻回甘。\n\n✨ 侍茶師建議：慢萃冷滴（0°C）或微冰，微糖 30% 搭配日本柚香寒天晶球，層次極富活力。",
        recommendedProductIds: ["hana-white-peach-oolong"],
        suggestedCustomization: {
          ice: "Slow Cold Drip (0°C)",
          sweetness: "30% Micro Cane Sugar",
          milk: "Classic Pure Tea (No Milk)",
          topping: "Organic Yuzu Konjac (+NT$20)",
        },
      };
    }

    if (q.includes("花") || q.includes("floral") || q.includes("清爽") || q.includes("桂花") || q.includes("東方美人") || q.includes("rose") || q.includes("flower")) {
      return {
        reply: isEn
          ? "To indulge in ethereal floral bouquets, I recommend our **Alishan Golden Osmanthus Jade Oolong**. Harvested at 1,400 meters altitude and naturally scented with autumn osmanthus petals, it offers crisp mountain mist aromas and golden nectar sweetness."
          : "喜愛幽雅花香的您，絕不能錯過**「阿里山金萱金桂幽香」**。採自海拔1400公尺高山，與秋季鮮採金桂自然窨製，金萱特有的天然奶萱香融合桂花蜜芳，如晨露般純淨。\n\n✨ 侍茶師建議：微冰 + 無糖 0%，加入手作金桂花釀茶凍，將花香層次推向極致。",
        recommendedProductIds: ["hana-alishan-osmanthus", "hana-oriental-beauty"],
        suggestedCustomization: {
          ice: "Light Ice (20%)",
          sweetness: "0% Pure Tea",
          milk: "Classic Pure Tea (No Milk)",
          topping: "Handcrafted Osmanthus Jelly (+NT$20)",
        },
      };
    }

    if (q.includes("炭") || q.includes("焙") || q.includes("鐵觀音") || q.includes("濃茶") || q.includes("roast") || q.includes("deep")) {
      return {
        reply: isEn
          ? "For an authentic charcoal tea ritual, I recommend our **Muzha Deep Charcoal Tieguanyin**. Traditional high-fire longan wood roasting imparts a deep amber liquor with warm orchid and roasted nut complexity."
          : "向您呈獻正統工夫慢焙之作**「木柵深焙正叢鐵觀音」**。歷經傳統龍眼木重火慢焙，茶湯呈沉穩琥珀色，帶有獨特「觀音韻」熟果酸香與堅果焦糖香氣，茶氣渾厚。\n\n✨ 侍茶師建議：熱泡現萃（85°C）或微冰去冰，建議無糖或 30% 微糖品嚐焙火深韻。",
        recommendedProductIds: ["hana-charcoal-iron-goddess"],
        suggestedCustomization: {
          ice: "Hot Infusion (85°C)",
          sweetness: "0% Pure Tea",
          milk: "Classic Pure Tea (No Milk)",
        },
      };
    }

    // Default Signature Recommendation
    return {
      reply: isEn
        ? "Welcome to Hana Drink. I have selected our crown jewel for you: **Sun Moon Lake Ruby No. 18 Cold Drip**. Extracted drop-by-drop over 16 hours, revealing wild cinnamon and a refreshing minty finish, followed by mountain wildflower nectar."
        : "歡迎蒞臨花飲茶舍。特別為您推薦花飲極致代表作**「日月潭紅玉十八號 · 慢萃冷滴」**。經由 0°C 低溫冰滴 16 小時逐滴凝鍊，完整保留天然野生肉桂與薄荷清涼尾韻，入口生津，如香水般層次分明。\n\n✨ 侍茶師建議：慢萃冷滴（0°C）原味無糖或 30% 微糖，建議搭配銀針白茶凝露茶凍。",
      recommendedProductIds: ["hana-ruby-18", "hana-uji-matcha"],
      suggestedCustomization: {
        ice: "Slow Cold Drip (0°C)",
        sweetness: "30% Micro Cane Sugar",
        milk: "Classic Pure Tea (No Milk)",
        topping: "Silver Needle White Tea Jelly (+NT$20)",
      },
    };
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json(generateHeuristicFallback());
  }

  // Model list with fallback options in case of 503 temporary demand spikes
  const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-3.7-flash"];

  const promptContents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const ai = getGenAI();

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          topP: 0.9,
        },
      });

      const fullText = response.text || "";
      if (!fullText) continue;

      let recommendedProductIds: string[] = [];
      let suggestedCustomization: any = null;
      let cleanReply = fullText;

      const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (Array.isArray(parsed.recommendedProductIds)) {
            recommendedProductIds = parsed.recommendedProductIds;
          }
          if (parsed.suggestedCustomization) {
            suggestedCustomization = parsed.suggestedCustomization;
          }
          cleanReply = fullText.replace(/```json\s*[\s\S]*?\s*```/, "").trim();
        } catch (e) {
          console.warn("JSON parse warning in model response:", e);
        }
      }

      if (recommendedProductIds.length === 0) {
        const match = TEA_PRODUCTS.find((p) => fullText.includes(p.nameZh) || fullText.includes(p.name));
        if (match) {
          recommendedProductIds.push(match.id);
        } else {
          recommendedProductIds = ["hana-ruby-18"];
        }
      }

      return res.json({
        reply: cleanReply,
        recommendedProductIds,
        suggestedCustomization,
      });
    } catch (modelError: any) {
      console.warn(`Model ${modelName} returned error: ${modelError?.message || modelError}`);
      // Continue loop to try next model
    }
  }

  // If all Gemini calls failed due to 503 / network limits, use the high-fidelity sommelier fallback
  console.warn("All Gemini models unavailable; serving intelligent sommelier fallback.");
  const fallback = generateHeuristicFallback();
  return res.json(fallback);
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HANA DRINK Server running on http://localhost:${PORT}`);
  });
}

startServer();
