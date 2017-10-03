import { compile } from 'ass-compiler';
import { bindEvents } from './events.js';
import { resize } from './resize.js';
import { $fixFontSize } from '../renderer/font-size.js';
import { createSVGEl } from '../utils.js';

const GLOBAL_CSS = '__GLOBAL_CSS__';

export function init(source, video, options = {}) {
  this.scale = 1;

  this._ = {
    index: 0,
    stagings: [],
    space: [],
    listener: {},
    $svg: createSVGEl('svg'),
    $defs: createSVGEl('defs'),
    $stage: document.createElement('div'),
    $animation: document.createElement('style'),
  };
  this._.$svg.appendChild(this._.$defs);
  this._.$stage.className = 'ASS-stage ASS-animation-paused';
  this._.$animation.type = 'text/css';
  this._.$animation.className = 'ASS-animation';
  document.head.appendChild(this._.$animation);

  this._.resampling = options.resampling || 'video_height';

  this.container = options.container || document.createElement('div');
  this.container.classList.add('ASS-container');
  this.container.appendChild($fixFontSize);
  this.container.appendChild(this._.$svg);
  this._.hasInitContainer = !!options.container;

  this.video = video;
  bindEvents.call(this);
  if (!this._.hasInitContainer) {
    const isPlaying = !video.paused;
    video.parentNode.insertBefore(this.container, video);
    this.container.appendChild(video);
    if (isPlaying && video.paused) {
      video.play();
    }
  }
  this.container.appendChild(this._.$stage);

  const { info, width, height, dialogues } = compile(source);
  this.info = info;
  this._.scriptRes = {
    width: width || video.videoWidth,
    height: height || video.videoHeight,
  };
  this.dialogues = dialogues;

  let $style = document.getElementById('ASS-global-style');
  if (!$style) {
    $style = document.createElement('style');
    $style.type = 'text/css';
    $style.id = 'ASS-global-style';
    $style.appendChild(document.createTextNode(GLOBAL_CSS));
    document.head.appendChild($style);
  }

  this._.inited = true;

  resize.call(this);

  return this;
}
