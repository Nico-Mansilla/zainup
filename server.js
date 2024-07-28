// Importamos las dependencias necesarias
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const socketIO = require('socket.io');
const http = require('http');

// Creamos una instancia de Express y del servidor HTTP
const app = express();
const server = http.createServer(app);

// Inicializamos Socket.IO sobre el servidor HTTP
const io = socketIO(server);

// Definimos el puerto en el que va a correr nuestro servidor
const port = process.env.PORT || 3000;

// Middleware para parsear las solicitudes en formato JSON
app.use(express.json());

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'nicolas',
    password: 'nicox1085', // Cambia esto a la contraseña de tu base de datos
    database: 'zainupDB'
});

// Conexión a la base de datos y manejo de errores
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Definimos la ruta para el registro de usuarios
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Hash de la contraseña con bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Inserción del nuevo usuario en la base de datos
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'User registered' });
    });
});

// Definimos la ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta a la base de datos para verificar el usuario
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];

        // Comparación de la contraseña con bcrypt
        if (bcrypt.compareSync(password, user.password)) {
            // Creación del token JWT
            const token = jwt.sign({ id: user.id }, 'secret_key');
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid password' });
        }
    });
});

// Configuración de Socket.IO para el chat en tiempo real
io.on('connection', socket => {
    console.log('New user connected');

    // Manejamos la unión a una sala de chat
    socket.on('join', room => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    // Manejamos los mensajes enviados por los usuarios
    socket.on('message', msg => {
        const { room, user_id, message } = msg;

        // Enviamos el mensaje a todos los usuarios en la sala
        io.to(room).emit('message', msg);

        // Guardamos el mensaje en la base de datos
        db.query('INSERT INTO messages (user_id, message) VALUES (?, ?)', [user_id, message], (err, result) => {
            if (err) console.error('Error saving message:', err);
        });
    });

    // Manejamos la desconexión de un usuario
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Iniciamos el servidor
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
