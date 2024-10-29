// src/controllers/BookingController.js
const knex = require('../database');

class BookingController {
  async index(req, res) {
    try {
      const { user_id, winery_id } = req.query;
      let query = knex('bookings')
        .select(
          'bookings.*',
          'wineries.name as winery_name',
          'users.username as user_name'
        )
        .join('wineries', 'bookings.winery_id', 'wineries.id')
        .join('users', 'bookings.user_id', 'users.id')
        .orderBy('bookings.visit_date', 'asc');

      if (user_id) {
        query = query.where('bookings.user_id', user_id);
      }

      if (winery_id) {
        query = query.where('bookings.winery_id', winery_id);
      }

      const bookings = await query;
      return res.json(bookings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const booking = await knex('bookings')
        .select(
          'bookings.*',
          'wineries.name as winery_name',
          'users.username as user_name'
        )
        .join('wineries', 'bookings.winery_id', 'wineries.id')
        .join('users', 'bookings.user_id', 'users.id')
        .where('bookings.id', id)
        .first();

      if (!booking) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      return res.json(booking);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar agendamento' });
    }
  }

  async store(req, res) {
    try {
      const {
        winery_id,
        visit_date,
        visit_time,
        number_of_people,
        colonial_breakfast,
        notes
      } = req.body;

      // Pega o user_id do token de autenticação
      const user_id = req.userData.id;

      // Validações básicas
      if (!winery_id || !visit_date || !visit_time || !number_of_people) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      // Verifica disponibilidade
      const existingBookings = await knex('bookings')
        .where({
          winery_id,
          visit_date,
          visit_time,
          status: 'confirmed'
        })
        .count('id as count')
        .first();

      if (existingBookings.count >= 5) { // Limite de 5 agendamentos por horário
        return res.status(400).json({ error: 'Horário não disponível' });
      }

      const [id] = await knex('bookings').insert({
        user_id,
        winery_id,
        visit_date,
        visit_time,
        number_of_people,
        colonial_breakfast,
        notes,
        status: 'pending'
      });

      return res.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Verifica se o usuário é dono da vinícola ou o próprio usuário
      const booking = await knex('bookings').where({ id }).first();
      
      if (!booking) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      await knex('bookings').where({ id }).update({
        status,
        updated_at: knex.fn.now()
      });

      return res.json({ message: 'Agendamento atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
  }

  async cancel(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userData.id;

      const booking = await knex('bookings')
        .where({ id })
        .first();

      if (!booking) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      if (booking.user_id !== user_id) {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      await knex('bookings')
        .where({ id })
        .update({
          status: 'cancelled',
          updated_at: knex.fn.now()
        });

      return res.json({ message: 'Agendamento cancelado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cancelar agendamento' });
    }
  }

  async checkAvailability(req, res) {
    try {
      const { winery_id, visit_date } = req.query;

      if (!winery_id || !visit_date) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const bookings = await knex('bookings')
        .where({
          winery_id,
          visit_date,
          status: 'confirmed'
        })
        .select('visit_time')
        .count('id as count')
        .groupBy('visit_time');

      // Horários disponíveis (9h às 17h, intervalos de 1h)
      const availableHours = Array.from({ length: 9 }, (_, i) => `${i + 9}:00`);
      
      const availability = availableHours.map(time => {
        const booked = bookings.find(b => b.visit_time === time);
        return {
          time,
          available: !booked || booked.count < 5,
          booked_count: booked ? booked.count : 0
        };
      });

      return res.json(availability);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao verificar disponibilidade' });
    }
  }
}

module.exports = new BookingController();