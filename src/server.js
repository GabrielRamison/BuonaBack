// src/server.js
const http = require('http');
const app = require('./app');  // Importa o app configurado
require('dotenv').config();

// Criar servidor HTTP com o app
const server = http.createServer(app);

// Configuração do Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
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
const HOST = '10.1.1.171'; // Seu IP local

server.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});