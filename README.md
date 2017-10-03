# ASS.js

[![Build status](https://img.shields.io/travis/weizhenye/ASS.svg)](https://travis-ci.org/weizhenye/ASS)
[![Coverage](https://img.shields.io/codecov/c/github/weizhenye/ASS.svg)](https://codecov.io/gh/weizhenye/ASS)
[![Dependencies](https://img.shields.io/david/weizhenye/ASS.svg)](https://david-dm.org/weizhenye/ASS)
[![NPM version](https://img.shields.io/npm/v/ass-renderer.svg)](https://www.npmjs.com/package/ass-renderer)
[![License](https://img.shields.io/npm/l/ass-renderer.svg)](https://github.com/weizhenye/ass-renderer/blob/master/LICENSE)
[![File size](https://badge-size.herokuapp.com/weizhenye/ASS/master/dist/ass.min.js?compression=gzip&color=blue&label=min%2Bgzip)](https://unpkg.com/asa-renderer/dist/ass.min.js)

ASS.js uses [ass-compiler](https://github.com/weizhenye/ass-compiler) to parse ASS subtitle file format, and then renderers subtitles on HTML5 video.

[Demo](https://ass.js.org/)

[ASS specs](https://github.com/weizhenye/ASS/wiki/ASS-%E5%AD%97%E5%B9%95%E6%A0%BC%E5%BC%8F%E8%A7%84%E8%8C%83)(zh-Hans)

<!--
## Installation

```bash
npm install ass-renderer
```
-->

## Usage

```html
<video id="video" src="example.mp4"></video>

<script src="dist/ass.min.js"></script>
<script>
fetch('/path/to/example.ass')
  .then(res => res.text())
  .then((text) => {
    const ass = new ASS(text, document.getElementById('video'));
  });
</script>
```

## API

#### Initialization

```js
const ass = new ASS(text, video, {
  // Subtitles will display in the container.
  // The container will be created automatically if it's not provided.
  container: document.getElementById('my-container'),

  // see resampling API below
  resampling: 'video_width',
});
```

#### Resize

If you change video's width or height, you should call it.

```js
ass.resize();
```

#### Show

```js
ass.show();
```

#### Hide

```js
ass.hide();
```

#### Destroy

```js
ass.destroy();
```

#### Resampling

When script resolution(PlayResX and PlayResY) don't match the video resolution, this API defines how it behaves. However, drawings and clips will be always depending on script origin resolution.

There are four valid values, we suppose video resolution is 1280x720 and script resolution is 640x480 in following situations:
* `video_width`: Script resolution will set to video resolution based on video width. Script resolution will set to 640x360, and scale = 1280 / 640 = 2.
* `video_height`(__default__): Script resolution will set to video resolution based on video height. Script resolution will set to 853.33x480, and scale = 720 / 480 = 1.5.
* `script_width`: Script resolution will not change but scale is based on script width. So scale = 1280 / 640 = 2. This may causes top and bottom subs disappear from video area.
* `script_height`: Script resolution will not change but scale is based on script height. So scale = 720 / 480 = 1.5. Script area will be centered in video area.

```js
ass.resampling = 'video_width';
```

## TODO

Items with <del>strikethrough</del> means they won't be supported.

* [Script Info]
  * ~~Synch Point~~
  * ~~PlayDepth~~
  * __WrapStyle__: 0, 3
  * __Collisions__: Reverse
* [Events]
  * ~~Picture~~
  * ~~Sound~~
  * ~~Movie~~
  * ~~Command~~
  * __Dialogue__
    + __Effect__
      - ~~Karaoke~~: as an effect type is obsolete
      - __Scroll up__: fadeawayheight
      - __Scroll down__: fadeawayheight
      - __Banner__: fadeawaywidth
    + __Text__ (override codes)
      - __\k, \kf, \ko, \kt, \K__: Karaoke
      - __\q__: 0, 3
      - __\t([&lt;t1&gt;, &lt;t2&gt;, ][&lt;accel&gt;, ]&lt;style modifiers&gt;)__: &lt;accel&gt;, \2c, \2a, \\[i]clip
* ~~[Fonts]~~
* ~~[Graphics]~~

## Known issues

* `\N` in Aegisub has less height than `<br>` in browsers, subbers should avoid to use multiple `\N` to position a dialogue, use `\pos` instead.
* A dialogue with multiple `\t` is not rendered correctly, for transforms in browsers are order-sensitive.
* When a dialogue has Effect (Banner, Scroll up, Scroll down) and `\move` at the same time, only `\move` works.
* For I'm using the `clip-path` CSS property to implement `\clip`, [IE and Edge are not supported yet](https://caniuse.com/#feat=css-clip-path).
* `\be` is just treated as `\blur`.
