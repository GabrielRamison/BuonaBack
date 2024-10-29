const setupSocket = () => {
  console.log('Iniciando conexão com:', SOCKET_URL);
  
  socket.current = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // Eventos de conexão
  socket.current.on('connect', () => {
    console.log('Conectado ao servidor de chat');
    socket.current.emit('join_room', {
      winery_id: vinicola.id,
      user_id: userId
    });
  });

  socket.current.on('connect_error', (error) => {
    console.error('Erro de conexão:', error);
    Alert.alert('Erro', 'Não foi possível conectar ao chat. Tente novamente.');
  });

  // Eventos de mensagem
  socket.current.on('receive_message', (message) => {
    console.log('Mensagem recebida:', message);
    setMessages(prev => [...prev, message]);
    if (message.user_id !== userId) {
      markMessagesAsRead();
    }
    flatListRef.current?.scrollToEnd();
  });

  // Eventos de digitação
  socket.current.on('user_typing', (data) => {
    console.log('Usuário digitando:', data);
    if (data.user_id !== userId) {
      setIsTyping(data.typing);
    }
  });

  // Eventos de leitura
  socket.current.on('messages_read', (data) => {
    console.log('Mensagens lidas por:', data);
    setMessages(prev => prev.map(msg => 
      msg.user_id === userId ? { ...msg, is_read: true, read_at: data.timestamp } : msg
    ));
  });

  socket.current.on('disconnect', () => {
    console.log('Desconectado do servidor');
  });
};