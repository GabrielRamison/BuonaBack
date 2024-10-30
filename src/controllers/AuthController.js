// src/controllers/AuthController.js
const knex = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      // Log para debug
      console.log('Dados recebidos:', { name, email, phone });

      // Verifica se o email já existe
      const userExists = await knex('users')
        .where({ email })
        .first();

      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insere o usuário
      const [userId] = await knex('users').insert({
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'customer',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Busca o usuário criado (sem a senha)
      const user = await knex('users')
        .select('id', 'name', 'email', 'phone', 'role')
        .where({ id: userId })
        .first();

      // Gera o token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Log de sucesso
      console.log('Usuário cadastrado:', user.id);

      return res.status(201).json({
        user,
        token
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({ 
        error: 'Erro ao cadastrar usuário',
        details: error.message 
      });
    }
  }
}

module.exports = new AuthController();