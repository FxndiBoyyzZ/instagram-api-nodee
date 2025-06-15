import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = "684ed637492e875ec9447e28";

app.get("/redis", async (req, res) => {
  const key = req.query.key;
  const username = key?.replace("profile-", "").replace("@", "");

  if (!username) return res.status(400).json({ error: "Usuário inválido" });

  try {
    const response = await axios.get(`https://api.scrapingdog.com/instagram`, {
      params: {
        api_key: API_KEY,
        username: username
      }
    });

    console.log("🔍 RESPOSTA COMPLETA:", response.data); // 👈 Isso aqui é pra debug

    res.json(response.data); // Envia tudo o que a API retornar

  } catch (err) {
    console.error("❌ Erro:", err.message);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
