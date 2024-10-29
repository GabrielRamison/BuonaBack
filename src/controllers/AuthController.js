// src/controllers/AuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../database');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      const userExists = await knex('users')
        .where({ email })
        .first();

      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [id] = await knex('users').insert({
        username,
        email,
        password: hashedPassword
      });

      const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      return res.status(201).json({ 
        user: { id, username, email },
        token 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await knex('users')
        .where({ email })
        .first();

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({ 
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao realizar login' });
    }
  }
}

module.exports = new AuthController();