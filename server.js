const express = require('express');
const cors = require('cors'); // Importa la librería cors
const route = require('./route');
const app = express();
const port = 3000;
app.use(express.json());

// Configura CORS para permitir solicitudes desde http://localhost:5173
app.use(cors({ origin: 'https://www.downloadmusic.cloud/' }));

// Resto de tu configuración...
app.use('/', route);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
