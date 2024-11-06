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

  async promoteToAdmin(req, res) {
    try {
      console.log('=== Início da Promoção para Admin ===');
      const { userId } = req.params;
  
      // Verifica se o usuário existe
      const user = await knex('users')
        .where({ id: userId })
        .first();
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Atualiza o role para admin
      await knex('users')
        .where({ id: userId })
        .update({
          role: 'admin',
          updated_at: knex.fn.now()
        });
  
      // Busca o usuário atualizado
      const updatedUser = await knex('users')
        .select('id', 'name', 'email', 'role', 'is_active')
        .where({ id: userId })
        .first();
  
      console.log('Usuário promovido a admin:', updatedUser);
  
      return res.status(200).json(updatedUser);
  
    } catch (error) {
      console.error('=== Erro na Promoção para Admin ===');
      console.error('Erro:', error);
      return res.status(500).json({
        error: 'Erro ao promover usuário para admin',
        details: error.message
      });
    }
  }

  async login(req, res) {
    try {
      console.log('\n=== Início do Login ===');
      console.log('Body completo recebido:', req.body);
      console.log('Dados processados:', {
        email: req.body.email,
        passwordRecebido: req.body.password,
        passwordLength: req.body.password?.length
      });
  
      const { email, password } = req.body;
  
      // Busca usuário e mostra dados completos
      const user = await knex('users')
        .where({ email: email.trim() })
        .first();
  
      console.log('\nBusca do usuário:', {
        encontrado: !!user,
        dadosEncontrados: user ? {
          id: user.id,
          email: user.email,
          role: user.role,
          hashSenha: user.password?.substring(0, 20) + '...',
          isActive: user.is_active
        } : null
      });
  
      if (!user) {
        console.log('Usuário não encontrado');
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }
  
      // Verifica senha com mais detalhes
      console.log('\nVerificando senha:', {
        senhaRecebida: password,
        hashArmazenado: user.password
      });
  
      const passwordValid = await bcrypt.compare(password, user.password);
      console.log('Resultado da verificação:', {
        senhaValida: passwordValid
      });
  
      if (!passwordValid) {
        console.log('Senha inválida');
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }
  
      if (!user.is_active) {
        console.log('Usuário inativo');
        return res.status(401).json({ error: 'Usuário inativo' });
      }
  
      // Gera token com mais logs
      const tokenData = {
        id: user.id,
        email: user.email,
        role: user.role
      };
  
      console.log('\nGerando token com dados:', tokenData);
  
      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      console.log('Token gerado com sucesso');
  
      const { password: _, ...userWithoutPassword } = user;
  
      return res.status(200).json({
        user: userWithoutPassword,
        token
      });
  
    } catch (error) {
      console.error('\n=== Erro no Login ===');
      console.error('Tipo:', error.name);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      return res.status(500).json({
        error: 'Erro ao realizar login',
        details: error.message
      });
    }
  }


  async diagnosticLogin(req, res) {
    try {
      console.log('\n=== Diagnóstico de Login ===');
      const { email, password } = req.body;
  
      console.log('1. Verificando dados recebidos:', {
        temEmail: !!email,
        emailRecebido: email,
        temSenha: !!password,
        senhaLength: password?.length
      });
  
      // Busca usuário
      const user = await knex('users')
        .where({ email: email.trim() })
        .first();
  
      console.log('2. Resultado da busca:', {
        usuarioEncontrado: !!user,
        dados: user ? {
          id: user.id,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
          hashParcial: user.password?.substring(0, 10) + '...'
        } : null
      });
  
      if (!user) {
        return res.status(200).json({ 
          status: 'erro',
          fase: 'busca',
          mensagem: 'Usuário não encontrado' 
        });
      }
  
      // Testa a senha
      const passwordValid = await bcrypt.compare(password, user.password);
  
      console.log('3. Verificação de senha:', {
        senhaValida: passwordValid,
        senhaFornecida: password,
        hashArmazenado: user.password
      });
  
      return res.status(200).json({
        status: 'sucesso',
        etapas: {
          dadosRecebidos: true,
          usuarioEncontrado: true,
          senhaValida: passwordValid,
          usuarioAtivo: user.is_active
        }
      });
  
    } catch (error) {
      console.error('Erro no diagnóstico:', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: error.message
      });
    }
  }
  async testPassword(req, res) {
    try {
      const { password } = req.body;
      const testHash = '$2a$10$qDqRVHwOWa.JyvS5X7uuEOPbmNs0jxiXf4kM/XpEFg5QJo85GZoGi'; // hash para '123456'
      
      const isValid = await bcrypt.compare(password, testHash);
      
      return res.json({
        password,
        hashTestado: testHash,
        senhaValida: isValid
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async resetAdminPassword(req, res) {
    try {
      console.log('=== Início do Reset de Senha Admin ===');
      
      // Hash da nova senha '123456'
      const newPassword = '123456';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      console.log('Tentando atualizar senha do admin');

      // Atualiza a senha do admin
      const updated = await knex('users')
        .where({ 
          email: 'admin@teste.com',
          role: 'admin'
        })
        .update({
          password: hashedPassword,
          updated_at: knex.fn.now()
        });

      if (updated === 0) {
        console.log('Nenhum usuário admin encontrado para atualizar');
        return res.status(404).json({ error: 'Usuário admin não encontrado' });
      }

      // Verifica se a atualização funcionou
      const user = await knex('users')
        .select('email', 'role', 'updated_at')
        .where({ email: 'admin@teste.com', role: 'admin' })
        .first();

      console.log('Senha do admin resetada com sucesso:', {
        email: user.email,
        role: user.role,
        updatedAt: user.updated_at
      });
      
      return res.json({ 
        message: 'Senha do admin resetada com sucesso',
        email: 'admin@teste.com',
        newPassword: '123456' // Remova esta linha em produção!
      });
    } catch (error) {
      console.error('Erro ao resetar senha do admin:', error);
      return res.status(500).json({ 
        error: 'Erro ao resetar senha',
        details: error.message 
      });
    }
  }
}

// Exporta uma nova instância
const authController = new AuthController();
module.exports = authController;