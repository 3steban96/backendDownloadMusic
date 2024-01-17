const fs = require('fs');
const ytdl = require('ytdl-core');

const downloadAudio = async (url, audioOptions, response) => {
  try {
    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = videoInfo.videoDetails.title;

    const sanitizedTitle = videoTitle.replace(/[/\\?%*:|"<>]/g, '-');

    const audio = ytdl(url, audioOptions);

    const audioWriteStream = fs.createWriteStream(`${sanitizedTitle}.mp3`);

    const audioBuffer = [];
    audio.on('data', (chunk) => {
      audioBuffer.push(chunk);
    });
    
    audio.on('end', () => {
      const audioData = Buffer.concat(audioBuffer).toString('base64');
      response.json({ message: 'Descarga de audio completada.', fileName: `${sanitizedTitle}.mp3`, audioData });
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
const downloadVideo = async (urlMp4, response) => {
  try {
    const options = {
      quality: 'highestvideo',
      filter: 'videoandaudio',
    };
    const video = ytdl(urlMp4, options);
    const videoInfo = await ytdl.getInfo(urlMp4);
    const videoTitle = videoInfo.videoDetails.title;

    const sanitizedTitle = videoTitle.replace(/[/\\?%*:|"<>]/g, '-');
    const videoWriteStream = fs.createWriteStream(`${sanitizedTitle}.mp4`);

    video.pipe(videoWriteStream);

    video.on('end', () => {
      console.log('Descarga completada.');

      // Establecer el encabezado Content-Disposition para sugerir el nombre de archivo al navegador
      response.attachment(`${sanitizedTitle}.mp4`);
      response.sendFile(path.resolve(`${sanitizedTitle}.mp4`), (err) => {
        if (err) {
          console.error('Error al enviar el archivo al cliente:', err.message);
          response.status(500).json({ error: 'Error al enviar el archivo al cliente.' });
        } else {
          console.log('Archivo enviado al cliente correctamente.');
        }
      });
    });

    video.on('error', (error) => {
      console.error('Error al descargar el video:', error.message);
      response.status(500).json({ error: 'Error al descargar el video.' });
    });

    video.on('progress', (chunkLength, downloaded, total) => {
      const percent = (downloaded / total) * 100;
      console.log(`Descargando: ${percent.toFixed(2)}%`);
    });

    videoWriteStream.on('finish', () => {
      console.log('Escritura del archivo de video finalizada.');
    });
  } catch (error) {
    console.error('Error al obtener información del video:', error.message);
    response.status(500).json({ error: 'Error al obtener información del video.' });
  }
};

const getInformation = async  (urlMp4) =>{
  try {
    const info = await ytdl.getBasicInfo(urlMp4);
    const singer = info.videoDetails.author.name;
    const song = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[3];
    return {singer, song, thumbnail};
  } catch (error) {
    console.error('Error al obtener información del video:', error.message);
    throw error;
  }
}
module.exports = { downloadAudio, downloadVideo, getInformation };
