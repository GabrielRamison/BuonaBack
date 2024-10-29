// src/controllers/EventController.js
const knex = require('../database');

class EventController {
  async index(req, res) {
    try {
      const { winery_id } = req.query;
      let query = knex('events')
        .select('events.*', 'wineries.name as winery_name')
        .join('wineries', 'events.winery_id', 'wineries.id')
        .where('events.start_date', '>=', new Date())
        .orderBy('events.start_date', 'asc');

      if (winery_id) {
        query = query.where('events.winery_id', winery_id);
      }

      const events = await query;
      return res.json(events);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const event = await knex('events')
        .select('events.*', 'wineries.name as winery_name')
        .join('wineries', 'events.winery_id', 'wineries.id')
        .where('events.id', id)
        .first();

      if (!event) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      return res.json(event);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar evento' });
    }
  }

  async store(req, res) {
    try {
      const {
        winery_id,
        name,
        description,
        start_date,
        end_date,
        price,
        capacity,
        image_url
      } = req.body;

      // Validação básica
      if (!winery_id || !name || !start_date) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const [id] = await knex('events').insert({
        winery_id,
        name,
        description,
        start_date,
        end_date,
        price,
        capacity,
        image_url
      });

      return res.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar evento' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      await knex('events').where({ id }).update(updateData);

      return res.json({ message: 'Evento atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar evento' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await knex('events').where({ id }).del();
      
      return res.json({ message: 'Evento removido com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover evento' });
    }
  }
}

module.exports = new EventController();