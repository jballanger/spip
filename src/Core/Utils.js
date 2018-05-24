const fetch = require('node-fetch');
const Canvas = require('canvas');
const fs = Promise.promisifyAll(require('fs'));

const { Image } = Canvas;

exports.randomColor = () => Math.floor(Math.random() * (0xFFFFFF + 1));

exports.randomNumber = (min, max) => (Math.floor(Math.random() * (max - min)) + min);

exports.loadImageUrl = url => new Promise(async (resolve, reject) => {
  if (!url) return null;
  const img = new Image();
  try {
    const res = await fetch(url);
    const buffer = await res.buffer();
    img.src = Buffer.alloc(buffer.length, buffer, 'base64');
  } catch (e) {
    return reject(e);
  }
  return resolve(img);
});

exports.loadImage = path => new Promise(async (resolve, reject) => {
  if (!path) return null;
  const img = new Image();
  try {
    const buffer = await fs.readFileAsync(`${process.cwd()}/${path}`);
    img.src = Buffer.alloc(buffer.length, buffer, 'base64');
  } catch (e) {
    return reject(e);
  }
  return resolve(img);
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

exports.parser = (args) => {
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    if (args[i].startsWith('-')) {
      const opt = args[i].replace(/^-+/, '');
      let value;
      while (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        i += 1;
        if (!value) value = args[i];
        else value += ` ${args[i]}`;
      }
      options[opt] = value || true;
    }
  }
  return options;
};

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

exports.mtoi = (type, m) => {
  const matches = type.exec(m);
  if (matches && matches.length > 1) return matches[1];
  return null;
};
