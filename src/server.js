// src/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configuração do CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Configuração do Socket.IO com CORS
const io = require('socket.io')(server, {
  cors: {
    origin: "*", // Em produção, você deve especificar os domínios permitidos
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('join_room', (data) => {
    console.log(`Usuário ${socket.id} entrando na sala ${data.winery_id}`);
    socket.join(`winery_${data.winery_id}`);
  });

  socket.on('send_message', (data) => {
    console.log('Mensagem recebida:', data);
    io.to(`winery_${data.winery_id}`).emit('receive_message', {
      id: Date.now(),
      content: data.message,
      sender_id: data.user_id,
      sender_name: data.user_name,
      created_at: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});