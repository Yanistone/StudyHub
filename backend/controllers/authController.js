const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const sign = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json("E-mail et mot de passe sont requis");

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json("E-mail déjà utilisé");

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash: hash,
      role: "USER",
      isActive: true,
      points: 0,
    });

    const token = sign(user);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json("E-mail et mot de passe sont requis");

    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) return res.status(401).json("E-mail ou mot de passe incorrect");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json("E-mail ou mot de passe incorrect");

    const token = sign(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "email",
        "username",
        "role",
        "isActive",
        "createdAt",
        "points",
      ],
    });
    res.json(user);
  } catch (e) {
    next(e);
  }
};
