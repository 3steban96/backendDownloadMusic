const express = require('express');
const router = express.Router();
const { downloadAudio, downloadVideo, getInformation } = require('./index.js');

router.post('/download', async (req, res) => {
  const { videoURL } = req.body;
  await downloadAudio(videoURL, { quality: 'highestaudio', filter: 'audioonly' }, res);
});
router.post('/downloadMp4', async (req, res) => {
  const { urlMp4 } = req.body;

  try {
    const { fileName, videoData } = await downloadVideo(urlMp4);

    const videoBuffer = await download(videoData);    
    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename=${encodeURIComponent(fileName)}`,
    });
    
    res.send(videoBuffer);
  } catch (error) {
    console.error('Error en la ruta de descarga:', error.message);
    res.status(500).json({ error: 'Error en la ruta de descarga.' });
  }
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

