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

    const user = response.data;

    res.json({
      nome: user.full_name,
      usuario: `@${user.username}`,
      foto: user.profile_pic,
      seguidores: user.followers,
      seguindo: user.following,
      publicacoes: user.posts,
      bio: user.biography,
      privado: user.is_private
    });

  } catch (err) {
    console.error("❌ Erro:", err.message);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
