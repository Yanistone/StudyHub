const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const articleRoutes = require("./routes/articles");
const proposalRoutes = require("./routes/proposals");
const commentRoutes = require("./routes/comments");
const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/categories");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));
// error handler
app.use(errorHandler);

// Route de santé + vérification DB
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Exemple d'API minimal (Articles en lecture seule)
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

const port = process.env.PORT;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
