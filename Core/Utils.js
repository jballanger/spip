const request = require('request');
const requestImage = require('request').defaults({ encoding: null });
const Canvas = require('canvas');

const { Image } = Canvas;

exports.randomColor = () => Math.floor(Math.random() * (0xFFFFFF + 1));

exports.randomNumber = (min, max) => Math.floor(Math.random() * ((max - min) + min));

exports.loadImageUrl = (...urls) => new Promise((resolve, reject) => {
  const images = [];
  let completed = 0;
  let i;
  for (i = 0; i < urls.length; i += 1) {
    const img = new Image();
    images.push(img);
    requestImage.get(urls[i], (err, res, data) => {
      if (err) reject(err);
      img.onload = () => {
        completed += 1;
        if (completed === urls.length) resolve(images);
      };
      img.src = Buffer.alloc(data.length, data, 'base64');
    });
  }
});

exports.uploadImage = (url, uid) => new Promise((resolve, reject) => {
  request.post(
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
    if (!tmpArgs[0].startsWith('-')) resolve({ options, tmpArgs });
  }
  if (!tmpArgs[0].startsWith('-')) resolve({ options, tmpArgs });
});

exports.validYoutubeUrl = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? 1 : 0;
};

exports.getHours = (date) => {
  let h = date.getHours() + 2;
  if (h > 23) h -= 24;
  return (h < 10 ? `0${h}` : h);
};

exports.getMinutes = (date) => {
  const m = date.getMinutes();
  return (m < 10 ? `0${m}` : m);
};
