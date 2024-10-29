// backend/src/server.js
const express = require('express');
const http = require('http');
require('dotenv').config();

const app = require('./app');
const server = http.createServer(app);
const io = require('socket.io')(server);

// Gerenciar conexões de chat
const chatConnections = new Map();

// backend/src/server.js
io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('join_room', (winery_id) => {
    console.log(`Usuário ${socket.id} entrou na sala da vinícola ${winery_id}`);
    socket.join(`winery_${winery_id}`);
  });

  socket.on('send_message', (data) => {
    console.log('Mensagem recebida:', data);
    const messageData = {
      id: Date.now(),
      content: data.message,
      sender_id: data.user_id || socket.id,
      sender_name: data.user_name || 'Usuário',
      created_at: new Date().toISOString()
    };
    // Emite para todos na sala, incluindo o remetente
    console.log('Mensagem formatada:', messageData); // Debug
    io.in(`winery_${data.winery_id}`).emit('receive_message', messageData);
  });

  socket.on('typing', (data) => {
    if (!data.user_id) {
      data.user_id = socket.id; // Usar ID do socket se não tiver user_id
    }
    console.log('Usuário digitando:', data);
    socket.to(`winery_${data.winery_id}`).emit('user_typing', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});