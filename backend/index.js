const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Route de santé + vérification DB
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Exemple d’API minimal (Articles en lecture seule)
app.get("/api/articles", async (req, res) => {
  const { Article, User, Category, Tag } = require("./models");
  const items = await Article.findAll({
    include: [
      { model: User, as: "author", attributes: ["id", "email"] },
      { model: Category, attributes: ["id", "name"] },
      { model: Tag, through: { attributes: [] } },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(items);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
