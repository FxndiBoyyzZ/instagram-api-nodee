import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/redis", async (req, res) => {
  const key = req.query.key;
  const username = key?.replace("profile-", "").replace("@", "");

  if (!username) return res.status(400).json({ error: "Usuário inválido" });

  try {
    const response = await axios.get(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const user = response.data.graphql.user;

    res.json({
      nome: user.full_name,
      usuario: `@${user.username}`,
      foto: user.profile_pic_url_hd,
      seguidores: user.edge_followed_by.count,
      seguindo: user.edge_follow.count,
      publicacoes: user.edge_owner_to_timeline_media.count,
      bio: user.biography
    });
  } catch {
    res.status(404).json({ error: "Usuário não encontrado ou privado" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
