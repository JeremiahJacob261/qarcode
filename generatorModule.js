/**
 * Generator Module - Real QR Code & Barcode Generation
 */

class GeneratorModule {
  /**
   * Generate a real QR code on a canvas.
   */
  generateQRCode(data, canvasElement) {
    const value = String(data || '').trim();
    if (!value) {
      throw new Error('QR content cannot be empty');
    }

    if (typeof qrcode !== 'function') {
      return this.generateFallbackQRCode(value, canvasElement);
    }

    const qr = qrcode(0, 'M');
    qr.addData(value, 'Byte');
    qr.make();

    const moduleCount = qr.getModuleCount();
    const quietZone = 4;
    const cellSize = Math.max(4, Math.floor(300 / (moduleCount + quietZone * 2)));
    const size = (moduleCount + quietZone * 2) * cellSize;

    canvasElement.width = size;
    canvasElement.height = size;

    const ctx = canvasElement.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#111111';

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            (col + quietZone) * cellSize,
            (row + quietZone) * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }

    return canvasElement;
  }

  /**
   * Generate a real barcode on a canvas.
   */
  generateBarcode(data, canvasElement, format = 'CODE128') {
    const value = String(data || '').trim();
    if (!value) {
      throw new Error('Barcode content cannot be empty');
    }

    if (typeof JsBarcode !== 'function') {
      return this.generateFallbackBarcode(value, canvasElement, format);
    }

    JsBarcode(canvasElement, value, {
      format: String(format || 'CODE128').toUpperCase(),
      lineColor: '#111111',
      background: '#FFFFFF',
      width: 2,
      height: 110,
      margin: 16,
      displayValue: true,
      font: 'monospace',
      fontSize: 16,
      textMargin: 10
    });

    return canvasElement;
  }

  /**
   * Fallback QR-like visual if the QR library is unavailable.
   */
  generateFallbackQRCode(data, canvasElement) {
    const size = 300;
    canvasElement.width = size;
    canvasElement.height = size;

    const qrData = this.encodeQR(data);
    const moduleSize = size / qrData.length;
    const ctx = canvasElement.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#111111';

    for (let y = 0; y < qrData.length; y++) {
      for (let x = 0; x < qrData[y].length; x++) {
        if (qrData[y][x]) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    return canvasElement;
  }

  /**
   * Fallback barcode-like visual if JsBarcode is unavailable.
   */
  generateFallbackBarcode(data, canvasElement, format = 'CODE128') {
    const width = 420;
    const height = 140;
    canvasElement.width = width;
    canvasElement.height = height;

    const ctx = canvasElement.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const barPattern = this.encodeBarcode(data, format);
    const barWidth = width / barPattern.length;

    ctx.fillStyle = '#111111';
    for (let i = 0; i < barPattern.length; i++) {
      if (barPattern[i] === '1') {
        ctx.fillRect(i * barWidth, 0, Math.ceil(barWidth), height - 34);
      }
    }

    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(data, width / 2, height - 10);

    return canvasElement;
  }

  /**
   * Simplified QR encoding fallback.
   */
  encodeQR(text) {
    const version = 1;
    const moduleCount = 21 + version * 4;
    const modules = Array(moduleCount).fill(null).map(() => Array(moduleCount).fill(false));

    this.addFinderPattern(modules, 0, 0);
    this.addFinderPattern(modules, moduleCount - 7, 0);
    this.addFinderPattern(modules, 0, moduleCount - 7);

    for (let i = 8; i < moduleCount - 8; i++) {
      modules[6][i] = modules[i][6] = i % 2 === 0;
    }

    const textBits = this.textToBinary(text);
    let bitIndex = 0;

    for (let y = moduleCount - 1; y >= 0 && bitIndex < textBits.length; y -= 2) {
      if (y === 6) y--;

      for (let x = moduleCount - 1; x >= 0 && bitIndex < textBits.length; x--) {
        if (!modules[y][x]) {
          modules[y][x] = textBits[bitIndex] === '1';
          bitIndex++;
        }
      }
    }

    return modules;
  }

  addFinderPattern(modules, offsetX, offsetY) {
    const pattern = [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ];

    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (offsetY + y < modules.length && offsetX + x < modules[0].length) {
          modules[offsetY + y][offsetX + x] = pattern[y][x] === 1;
        }
      }
    }
  }

  encodeBarcode(text) {
    let barPattern = '11010010000';

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i) % 128;
      barPattern += this.barcodeCharToPattern(code);
    }

    barPattern += '1100011101011';
    return barPattern;
  }

  barcodeCharToPattern(code) {
    const patterns = [
      '11011001100', '11001101100', '11001100110', '10010011000',
      '10010001100', '10001001100', '10011001000', '10011000100',
      '10001100100', '11001001000', '11001000100', '11000100100'
    ];

    return patterns[code % patterns.length];
  }

  textToBinary(text) {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      binary += text.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return binary;
  }

  canvasToPNG(canvasElement) {
    return new Promise((resolve, reject) => {
      canvasElement.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to PNG'));
        }
      }, 'image/png');
    });
  }

  downloadImage(canvasElement, filename) {
    const link = document.createElement('a');
    link.href = canvasElement.toDataURL('image/png');
    link.download = filename || 'code.png';
    link.click();
  }

  canvasToBase64(canvasElement) {
    return canvasElement.toDataURL('image/png');
  }
}

const generator = new GeneratorModule();
