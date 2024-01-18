const express = require('express');
const router = express.Router();
const { downloadAudio, downloadVideo, getInformation } = require('./index.js');

router.post('/download', async (req, res) => {
  const { videoURL } = req.body;
  await downloadAudio(videoURL, { quality: 'highestaudio', filter: 'audioonly' }, res);
});
router.post('/downloadMp4', async (req, res) => {
  const { urlMp4 } = req.body;

  await downloadVideo(urlMp4, res); // Cambia aquí
});

router.post('/getInformation', async (req, res) => {
  const { urlMp4 } = req.body;
  try {
    const informacion = await getInformation(urlMp4);
    res.json(informacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener información del video' });
  }
});
module.exports = router;

