import {Image as CanvasImage} from 'react-native-canvas';

export default function loadImage(canvas, url) {
  return new Promise((resolve, reject) => {
    const image = new CanvasImage(canvas);
    image.src = url;
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', err => reject(err));
  });
}
