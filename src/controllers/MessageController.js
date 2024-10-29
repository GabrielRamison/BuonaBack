// src/controllers/MessageController.js
const knex = require('../database');

class MessageController {
  // Buscar histórico de mensagens
  async getHistory(req, res) {
    try {
      const { winery_id } = req.params;
      const { user_id } = req.userData;

      const messages = await knex('chat_messages')
        .select(
          'chat_messages.*',
          'users.name as sender_name'
        )
        .join('users', 'chat_messages.user_id', 'users.id')
        .where('winery_id', winery_id)
        .orderBy('created_at', 'asc')
        .limit(50);  // Limita a 50 mensagens mais recentes

      // Atualiza o último acesso do usuário
      await knex('chat_participants')
        .insert({
          winery_id,
          user_id,
          last_read_at: new Date()
        })
        .onConflict(['winery_id', 'user_id'])
        .merge({ last_read_at: new Date() });

      return res.json(messages);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return res.status(500).json({ error: 'Erro ao buscar histórico de mensagens' });
    }
  }

  // Marcar mensagens como lidas
  async markAsRead(req, res) {
    try {
      const { winery_id } = req.params;
      const { user_id } = req.userData;

      await knex('chat_messages')
        .where({
          winery_id,
          is_read: false
        })
        .whereNot('user_id', user_id)
        .update({
          is_read: true,
          read_at: new Date()
        });

      return res.json({ success: true });
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
      return res.status(500).json({ error: 'Erro ao marcar mensagens como lidas' });
    }
  }

  // Contar mensagens não lidas
  async getUnreadCount(req, res) {
    try {
      const { user_id } = req.userData;

      const unreadCounts = await knex('chat_messages')
        .select('winery_id')
        .count('* as count')
        .where('is_read', false)
        .whereNot('user_id', user_id)
        .groupBy('winery_id');

      return res.json(unreadCounts);
    } catch (error) {
      console.error('Erro ao contar mensagens não lidas:', error);
      return res.status(500).json({ error: 'Erro ao contar mensagens não lidas' });
    }
  }
}

module.exports = new MessageController();