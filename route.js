const express = require('express');
const router = express.Router();
const { downloadAudio } = require('./index.js');

router.post('/download', async (req, res) => {
  const { videoURL } = req.body;

  // Validar la URL, si es necesario

  // Llamar a la función downloadAudio con la URL proporcionada
  await downloadAudio(videoURL, { quality: 'highestaudio', filter: 'audioonly' }, res);
});

module.exports = router;

