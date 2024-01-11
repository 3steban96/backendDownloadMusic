const fs = require('fs');
const ytdl = require('ytdl-core');

const downloadAudio = async (url, audioOptions, response) => {
  try {
    // Obtener información del video para obtener el título
    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = videoInfo.videoDetails.title;

    // Reemplazar caracteres no permitidos en nombres de archivo
    const sanitizedTitle = videoTitle.replace(/[/\\?%*:|"<>]/g, '-');

    const audio = ytdl(url, audioOptions);

    const audioWriteStream = fs.createWriteStream(`${sanitizedTitle}.mp3`);

    audio.pipe(audioWriteStream);

    audio.on('end', () => {
      console.log('Descarga de audio completada.');
      response.json({ message: 'Descarga de audio completada.', fileName: `${sanitizedTitle}.mp3` });
    });

    audio.on('error', (error) => {
      console.error('Error al descargar el audio:', error.message);
      response.status(500).json({ error: 'Error al descargar el audio.' });
    });

    audio.on('progress', (chunkLength, downloaded, total) => {
      const percent = (downloaded / total) * 100;
      console.log(`Descargando audio: ${percent.toFixed(2)}%`);
    });
  } catch (error) {
    console.error('Error al obtener información del video:', error.message);
    response.status(500).json({ error: 'Error al obtener información del video.' });
  }
};

module.exports = { downloadAudio };
