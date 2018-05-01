const fetch = require('node-fetch');
const Canvas = require('canvas');
const fs = Promise.promisifyAll(require('fs'));

const { Image } = Canvas;

exports.randomColor = () => Math.floor(Math.random() * (0xFFFFFF + 1));

exports.randomNumber = (min, max) => (Math.floor(Math.random() * (max - min)) + min);

exports.loadImageUrl = (url) => new Promise(async (resolve, reject) => {
  if (!url) return null;
  const img = new Image();
  try {
    const res = await fetch(url);
    const buffer = await res.buffer();
    img.src = Buffer.alloc(buffer.length, buffer, 'base64');
  } catch (e) {
    return reject(e);
  }
  resolve(img);
});

exports.loadImage = (path) => new Promise(async (resolve, reject) => {
  if (!path) return null;
  const img = new Image();
  try {
    const buffer = await fs.readFileAsync(`${process.cwd()}/${path}`);
    img.src = Buffer.alloc(buffer.length, buffer, 'base64');
  } catch (e) {
    return reject(e);
  }
  resolve(img);
});

exports.uploadImage = (url, uid) => new Promise((resolve, reject) => {
  fetch.post(
    _config.image_hosting.url,
    {
      form: {
        url,
        uid,
      },
    }, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    },
  );
});

exports.parser = args => new Promise(async (resolve) => {
  const options = [];
  let tmpArgs = args;
  if (tmpArgs.length < 1) resolve({ options, tmpArgs });
  while (tmpArgs[0].startsWith('-')) {
    options.push(tmpArgs[0]);
    tmpArgs = tmpArgs.slice(1);
    if (!tmpArgs[0].startsWith('-')) resolve({ options, args: tmpArgs });
  }
  if (!tmpArgs[0].startsWith('-')) resolve({ options, args: tmpArgs });
});

exports.validYoutubeUrl = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? 1 : 0;
};

exports.getHours = (date) => {
  let h = date.getHours();
  if (h > 23) h -= 24;
  return (h < 10 ? `0${h}` : h);
};

exports.getMinutes = (date) => {
  const m = date.getMinutes();
  return (m < 10 ? `0${m}` : m);
};
