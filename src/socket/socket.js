const setupSocket = () => {
  socketRef.current = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    extraHeaders: {
      "Access-Control-Allow-Origin": "*"
    }
  });

  socketRef.current.on('connect', () => {
    console.log('Conectado ao socket');
    socketRef.current.emit('join_room', {
      winery_id: vinicola?.id,
      user_id: userId
    });
  });

  socketRef.current.on('connect_error', (error) => {
    console.error('Erro de conexão:', error);
  });

  socketRef.current.on('receive_message', (message) => {
    console.log('Mensagem recebida:', message);
    setMessages(prev => [...prev, message]);
    flatListRef.current?.scrollToEnd();
  });
};

const handleSend = () => {
  if (!newMessage.trim() || !socketRef.current || !userId) {
    console.log('Não pode enviar:', { 
      newMessage: newMessage.trim(), 
      socket: !!socketRef.current, 
      userId 
    });
    return;
  }

  console.log('Enviando mensagem:', {
    winery_id: vinicola?.id,
    message: newMessage.trim(),
    user_id: userId,
    user_name: userName
  });

  socketRef.current.emit('send_message', {
    winery_id: vinicola?.id,
    message: newMessage.trim(),
    user_id: userId,
    user_name: userName
  });

  setNewMessage('');
};