/**
 * Scanner Module - Real QR Code & Barcode Detection
 */

class ScannerModule {
  constructor() {
    this.isScanning = false;
    this.isDetecting = false;
    this.stream = null;
    this.video = null;
    this.videoTrack = null;
    this.detector = null;
    this.supportedFormats = [];
    this.torchEnabled = false;
  }

  /**
   * Initialize the native BarcodeDetector when available.
   */
  async initializeDetector() {
    if (this.detector || typeof BarcodeDetector === 'undefined') {
      return Boolean(this.detector);
    }

    const preferredFormats = [
      'qr_code',
      'ean_13',
      'ean_8',
      'upc_a',
      'upc_e',
      'code_128',
      'code_39',
      'itf',
      'codabar',
      'pdf417',
      'aztec',
      'data_matrix'
    ];

    try {
      const supported = typeof BarcodeDetector.getSupportedFormats === 'function'
        ? await BarcodeDetector.getSupportedFormats()
        : preferredFormats;

      this.supportedFormats = preferredFormats.filter((format) => supported.includes(format));
      this.detector = new BarcodeDetector({
        formats: this.supportedFormats.length ? this.supportedFormats : preferredFormats
      });
      return true;
    } catch (error) {
      console.warn('BarcodeDetector initialization failed:', error);
      this.detector = null;
      this.supportedFormats = [];
      return false;
    }
  }

  /**
   * Initialize camera scanning.
   */
  async initCamera(videoElement) {
    try {
      this.video = videoElement;
      await this.initializeDetector();

      const preferredConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      try {
        this.stream = await navigator.mediaDevices.getUserMedia(preferredConstraints);
      } catch (primaryError) {
        console.warn('Environment camera unavailable, retrying with default camera:', primaryError);
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      this.videoTrack = this.stream.getVideoTracks()[0] || null;
      this.video.srcObject = this.stream;
      this.video.muted = true;
      this.video.setAttribute('playsinline', 'true');

      await this.video.play();
      await this.waitForVideoFrame(this.video);

      this.isScanning = true;
      return true;
    } catch (error) {
      console.error('Camera error:', error);
      alert('Unable to access camera. Please check permissions and try again.');
      return false;
    }
  }

  /**
   * Scan a live frame from the camera.
   */
  async scanFrame(canvasElement) {
    if (!this.video || !this.isScanning || this.isDetecting) {
      return null;
    }

    if (this.video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !this.video.videoWidth) {
      return null;
    }

    this.isDetecting = true;

    try {
      this.drawSourceToCanvas(this.video, canvasElement, 1280);
      return await this.detectFromCanvas(canvasElement);
    } finally {
      this.isDetecting = false;
    }
  }

  /**
   * Scan an uploaded image file.
   */
  async scanFile(file) {
    const image = await this.loadImageFromFile(file);
    const canvas = document.createElement('canvas');
    this.drawSourceToCanvas(image, canvas, 1600);

    const result = await this.detectFromCanvas(canvas);
    if (!result) {
      throw new Error('No QR code or barcode found in that image');
    }

    return result;
  }

  /**
   * Detect codes using native BarcodeDetector first, then jsQR for QR fallback.
   */
  async detectFromCanvas(canvasElement) {
    const nativeResult = await this.detectWithBarcodeDetector(canvasElement);
    if (nativeResult) {
      return nativeResult;
    }

    return this.detectWithJsQR(canvasElement);
  }

  /**
   * Use the browser BarcodeDetector API when available.
   */
  async detectWithBarcodeDetector(source) {
    await this.initializeDetector();

    if (!this.detector) {
      return null;
    }

    try {
      const detections = await this.detector.detect(source);
      if (!detections.length) {
        return null;
      }

      const bestDetection = detections
        .filter((entry) => entry.rawValue)
        .sort((a, b) => this.getDetectionArea(b) - this.getDetectionArea(a))[0];

      return bestDetection ? this.normalizeNativeDetection(bestDetection) : null;
    } catch (error) {
      console.warn('BarcodeDetector detect failed:', error);
      return null;
    }
  }

  /**
   * QR-only fallback using the bundled jsQR decoder.
   */
  detectWithJsQR(canvasElement) {
    if (typeof window.jsQR !== 'function') {
      return null;
    }

    try {
      const context = canvasElement.getContext('2d', { willReadFrequently: true });
      const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const result = window.jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      });

      if (!result || !result.data) {
        return null;
      }

      return {
        type: 'qr',
        format: 'qr_code',
        value: result.data,
        cornerPoints: result.location ? [
          result.location.topLeftCorner,
          result.location.topRightCorner,
          result.location.bottomRightCorner,
          result.location.bottomLeftCorner
        ] : []
      };
    } catch (error) {
      console.warn('jsQR detect failed:', error);
      return null;
    }
  }

  /**
   * Draw a video/image source to canvas while keeping the image performant to scan.
   */
  drawSourceToCanvas(source, canvasElement, maxDimension) {
    const sourceWidth = source.videoWidth || source.naturalWidth || source.width;
    const sourceHeight = source.videoHeight || source.naturalHeight || source.height;
    const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));

    canvasElement.width = Math.max(1, Math.round(sourceWidth * scale));
    canvasElement.height = Math.max(1, Math.round(sourceHeight * scale));

    const context = canvasElement.getContext('2d', { willReadFrequently: true });
    context.drawImage(source, 0, 0, canvasElement.width, canvasElement.height);
  }

  /**
   * Convert a native detection into the app's shared payload shape.
   */
  normalizeNativeDetection(detection) {
    const format = (detection.format || 'unknown').toLowerCase();

    return {
      type: format === 'qr_code' ? 'qr' : 'barcode',
      format,
      value: detection.rawValue,
      boundingBox: detection.boundingBox || null,
      cornerPoints: detection.cornerPoints || []
    };
  }

  /**
   * Torch support is useful on mobile when the camera feed is dark.
   */
  canToggleTorch() {
    const capabilities = this.videoTrack && typeof this.videoTrack.getCapabilities === 'function'
      ? this.videoTrack.getCapabilities()
      : null;

    return Boolean(capabilities && capabilities.torch);
  }

  /**
   * Toggle the device torch when the browser and camera expose it.
   */
  async toggleTorch(forceState) {
    if (!this.videoTrack || !this.canToggleTorch()) {
      return false;
    }

    const nextState = typeof forceState === 'boolean' ? forceState : !this.torchEnabled;

    try {
      await this.videoTrack.applyConstraints({
        advanced: [{ torch: nextState }]
      });
      this.torchEnabled = nextState;
      return this.torchEnabled;
    } catch (error) {
      console.warn('Torch toggle failed:', error);
      return false;
    }
  }

  /**
   * Describe the scan stack so the UI can communicate what will work.
   */
  getCapabilities() {
    return {
      hasNativeDetector: Boolean(this.detector),
      hasQrFallback: typeof window.jsQR === 'function',
      canToggleTorch: this.canToggleTorch(),
      supportedFormats: [...this.supportedFormats]
    };
  }

  /**
   * Stop camera streaming and reset runtime state.
   */
  stopCamera() {
    this.isScanning = false;
    this.isDetecting = false;
    this.torchEnabled = false;

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
    }

    this.stream = null;
    this.videoTrack = null;
  }

  /**
   * Wait until the video element has actual frame dimensions before scanning.
   */
  waitForVideoFrame(videoElement) {
    return new Promise((resolve) => {
      if (videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && videoElement.videoWidth) {
        resolve();
        return;
      }

      const onReady = () => {
        if (videoElement.videoWidth) {
          videoElement.removeEventListener('loadeddata', onReady);
          videoElement.removeEventListener('loadedmetadata', onReady);
          resolve();
        }
      };

      videoElement.addEventListener('loadeddata', onReady);
      videoElement.addEventListener('loadedmetadata', onReady);
    });
  }

  /**
   * Read an uploaded image into an HTMLImageElement.
   */
  loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Failed to load selected image'));
        image.src = event.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read selected image'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Prefer the most prominent detection when multiple codes are visible.
   */
  getDetectionArea(detection) {
    if (!detection.boundingBox) {
      return 0;
    }

    return (detection.boundingBox.width || 0) * (detection.boundingBox.height || 0);
  }
}

const scanner = new ScannerModule();
