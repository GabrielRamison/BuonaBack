// src/controllers/AuthController.js
const knex = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  async register(req, res) {
    try {
      console.log('Requisição recebida:', {
        body: req.body,
        headers: req.headers
    });
      console.log('=== Início do Registro ===');
      const { name, email, password, phone } = req.body;

      // Verifica se o email já existe
      const userExists = await knex('users')
        .where({ email })
        .first();

      if (userExists) {
        console.log('Email já cadastrado:', email);
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
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      });

      // Busca o usuário criado
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

      return res.status(201).json({
        user,
        token
      });

    } catch (error) {
      console.error('=== Erro no Registro ===');
      console.error('Erro:', error);
      return res.status(500).json({ 
        error: 'Erro ao cadastrar usuário',
        details: error.message 
      });
    }
  }

  async login(req, res) {
    try {
      console.log('=== Início do Login ===');
      console.log('Dados recebidos:', req.body);

      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        console.log('Email ou senha não fornecidos');
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Busca o usuário
      const user = await knex('users')
        .where({ email })
        .first();

      console.log('Usuário encontrado:', user ? 'Sim' : 'Não');

      if (!user) {
        console.log('Usuário não encontrado');
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      // Verifica a senha
      const passwordValid = await bcrypt.compare(password, user.password);
      console.log('Senha válida:', passwordValid);

      if (!passwordValid) {
        console.log('Senha inválida');
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      // Verifica se o usuário está ativo
      if (!user.is_active) {
        console.log('Usuário inativo');
        return res.status(401).json({ error: 'Usuário inativo' });
      }

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

      // Remove a senha do objeto do usuário
      const { password: _, ...userWithoutPassword } = user;

      console.log('Login bem-sucedido para:', email);

      return res.status(200).json({
        user: userWithoutPassword,
        token
      });

    } catch (error) {
      console.error('=== Erro no Login ===');
      console.error('Tipo do erro:', error.name);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      
      return res.status(500).json({
        error: 'Erro ao realizar login',
        details: error.message
      });
    }
  }
}

// Exporta uma nova instância
const authController = new AuthController();
module.exports = authController;