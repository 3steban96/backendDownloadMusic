const express = require('express');
const cors = require('cors'); // Importa la librería cors
const route = require('./route');
const app = express();
const port = 3000;
app.use(express.json());

app.use('/', route);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://www.downloadmusic.cloud");
  res.header(
    "Access-Control-Allow-Headers",
    "x-auth-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE, PATCH"
  );
  next();
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
