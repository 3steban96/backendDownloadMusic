const express = require('express');
const cors = require('cors');
const route = require('./route');
const app = express();
const port = 3000;
app.use(express.json());
app.use('/', route);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});