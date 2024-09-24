import {createPane} from "./modules/tweakpane.js";

const videoResolutions = [
  {
    name: "SD 480p",
    ratio: "4:3",
    size: {width: 640, height: 480}
  },
  {
    name: "HD 720p",
    ratio: "16:9",
    size: {width: 1280, height: 720}
  },
  {
    name: "Full HD 1080p",
    ratio: "16:9",
    size: {width: 1920, height: 1080}
  },
  {
    name: "Quad HD 1440p",
    ratio: "16:9",
    size: {width: 2560, height: 1440}
  },
  {
    name: "4K Ultra HD",
    ratio: "16:9",
    size: {width: 3840, height: 2160}
  },
  {
    name: "8K Ultra HD",
    ratio: "16:9",
    size: {width: 7680, height: 4320}
  },
  {
    name: "Cinema 2K",
    ratio: "17:9",
    size: {width: 2048, height: 1080}
  },
  {
    name: "Cinema 4K",
    ratio: "17:9",
    size: {width: 4096, height: 2160}
  },
  {
    name: "UltraWide 1440p",
    ratio: "21:9",
    size: {width: 3440, height: 1440}
  },
  {
    name: "UltraWide 1080p",
    ratio: "21:9",
    size: {width: 2560, height: 1080}
  }
];

/**
 * @typedef { import("./main").TweakPaneParams } TweakPaneParams
 */

/** @type {TweakPaneParams} */
const PARAMS = {
  debug: false,
  grayscale: false,
  circleSize: 100,
  theme: 'system',
  zoom: {
    min: 0,
    max: 0,
    step: 0,
    value: 0
  },
  video: {
    width: 1280,
    height: 720,
    frameRate: 30,
    facingMode: 'environment'
  },
  output: {
    type: 'image/jpeg',
    quality: 1
  }
};

/** @type {HTMLVideoElement} */
let videoElem = null;
/** @type {HTMLCanvasElement} */
let canvasElem = null;

function clearPhoto() {
  const context = canvasElem.getContext('2d');
  context.fillStyle = '#AAA';
  context.fillRect(0, 0, canvasElem.width, canvasElem.height);
}

function takeVideoSnapshot() {
  const context = canvasElem.getContext('2d');

  canvasElem.width = PARAMS.video.width;
  canvasElem.height = PARAMS.video.height;

  context.drawImage(videoElem, 0, 0, PARAMS.video.width, PARAMS.video.height);
  if (PARAMS.video.facingMode !== 'environment') {
    context.translate(videoElem.videoWidth, 0);
    context.scale(-1, 1);
  }

  return canvasElem.toDataURL(PARAMS.output.type, PARAMS.output.quality);
}

function takePicture() {
  const photoElem = document.getElementById('photo');

  const data = takeVideoSnapshot();
  photoElem.setAttribute('src', data);

  const dialog = document.querySelector('dialog');
  dialog.showModal();
}

async function createVideoStream() {
  try {
    console.log('createVideoStream(MediaTrackConstraints)', PARAMS.video);
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: {ideal: PARAMS.video.width},
        height: {ideal: PARAMS.video.height},
        frameRate: {ideal: PARAMS.video.frameRate},
        facingMode: {ideal: PARAMS.video.facingMode},
        zoom: true
      },
      audio: false
    });

    videoElem.srcObject = mediaStream;

    const [track] = mediaStream.getVideoTracks();
    const capabilities = track.getCapabilities();
    const settings = track.getSettings();

    if ('zoom' in settings) {
      PARAMS.zoom.min = capabilities.zoom.min;
      PARAMS.zoom.max = capabilities.zoom.max;
      PARAMS.zoom.step = capabilities.zoom.step;
      PARAMS.zoom.value = settings.zoom;
    } else {
      console.log('Zoom is not supported by ' + track.label);
    }

    await videoElem.play();
  } catch (err) {
    console.error(`An error occurred: ${err}`);
  }
}

async function getVideoInputs() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return "MediaDevices API not supported by this browser.";
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput').map(device => ({
      id: device.deviceId || 'N/A',
      label: device.label || 'N/A'
    }));
  } catch (err) {
    return "Error: " + err.name + ": " + err.message;
  }
}

async function togglePictureInPicture() {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled && videoElem) {
      await videoElem.requestPictureInPicture();
    }
    return true;
  } catch (e) {
    return false;
  }
}

window.addEventListener('load', async () => {
  videoElem = document.getElementById('video');
  videoElem.disablePictureInPicture = true;
  canvasElem = document.getElementById('canvas');

  const pane = createPane();

  pane.addBinding(PARAMS, 'debug', {
    label: 'Debug',
  }).on('change', function (ev) {
    document.documentElement.dataset.debug = ev.value;
  });

  pane.addBinding(PARAMS, 'theme', {
    label: 'Theme',
    options: {
      System: 'system',
      Light: 'light',
      Dark: 'dark',
    },
  }).on('change', function (ev) {
    document.documentElement.dataset.theme = ev.value;
  });

  pane.addButton({
    title: 'TogglePictureInPicture'
  }).on('click', () => {
    togglePictureInPicture();
  });

  const inputPane = pane.addFolder({title: 'Input'});
  inputPane.addBinding(PARAMS.video, 'width', {
    label: 'Resolution\n(ideal)',
    options: Object.fromEntries(videoResolutions.map(resolution => [resolution.name, resolution.size.width])),
  }).on('change', (el) => {
    const resolution = videoResolutions.find(resolution => resolution.size.width === el.value);
    if (resolution) {
      PARAMS.video.height = resolution.size.height;
    }
    createVideoStream();
  });

  inputPane.addBinding(PARAMS.video, 'frameRate', {
    label: 'FrameRate\n(ideal)',
    options: {
      '24fps': 24,
      '30fps': 30,
      '60+fps': 60,
    },
  }).on('change', (el) => {
    createVideoStream();
  });

  inputPane.addBinding(PARAMS.video, 'facingMode', {
    label: 'FacingMode',
    options: {
      'User': 'user',
      'Environment': 'environment',
      'Left': 'left',
      'Right': 'right',
    },
  }).on('change', () => {
    createVideoStream();
  });

  inputPane.addBlade({
    view: 'text',
    label: 'Zoom',
    format: (v) => `${v.value} (St:${v.step}, Mi:${v.min}, Ma:${v.max})`,
    parse: (v) => v,
    value: PARAMS.zoom,
  });

  inputPane.addBinding(PARAMS, 'circleSize', {
    label: 'MaskSize',
    min: 100,
    max: 800,
    format: (v) => v.toFixed(0)
  }).on('change', function (ev) {
    document.documentElement.style.setProperty('--mask-size', `${ev.value}px`)
  });

  inputPane.addBinding(PARAMS, 'grayscale', {
    label: 'Grayscale',
  }).on('change', function (ev) {
    document.documentElement.dataset.grayscale = ev.value;
  });

  const outputPane = pane.addFolder({title: 'Output'});
  outputPane.addBinding(PARAMS.output, 'type', {
    label: 'Format',
    options: {
      PNG: 'image/png',
      JPEG: 'image/jpeg',
      WEBP: 'image/webp',
    },
  });
  outputPane.addBinding(PARAMS.output, 'quality', {
    label: 'Quality',
    min: 0.1,
    max: 1,
  });

  pane.addButton({
    title: 'Take Photo'
  }).on('click', () => {
    clearPhoto();
    takePicture();
  });

  pane.addButton({
    title: 'Download Photo'
  }).on('click', () => {
    const link = document.createElement('a')
    link.href = takeVideoSnapshot();
    link.download = 'image file name here'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  });

  const videoInputs = await getVideoInputs();

  const devicePane = pane.addFolder({title: 'VideoInput'});
  if (Array.isArray(videoInputs)) {
    videoInputs.forEach((device) => {
      devicePane.addBlade({
        view: 'text',
        label: device.id.substring(0, 8),
        format: (v) => `${v.label} (${v.id})`,
        parse: (v) => v,
        value: device,
      });
    });

    devicePane.addButton({
      title: 'Copy to clipboard'
    }).on('click', async () => {
      await navigator.clipboard.writeText(videoInputs.map(JSON.stringify).join(','));
    });
  } else {
    devicePane.addBlade({
      view: 'text',
      label: 'Error',
      parse: (v) => v,
      value: videoInputs,
    });
  }

  const screenPane = pane.addFolder({title: 'Screen Information'});
  screenPane.addBlade({
    view: 'text',
    label: 'Resolution',
    format: (v) => `${v.width}x${v.height}`,
    parse: (v) => v,
    value: window.screen,
  });
  screenPane.addBlade({
    view: 'text',
    label: 'PixelDepth',
    format: (v) => String(v.pixelDepth),
    parse: (v) => v,
    value: window.screen,
  });

  const miscPane = pane.addFolder({title: 'Misc'});
  miscPane.addButton({
    title: 'Refresh'
  }).on('click', () => {
    pane.refresh();
  });

  await createVideoStream();
});
