// types/qrcode.d.ts

declare module "qrcode" {
  export interface QRCodeToCanvasOptions {
    width?: number;
    margin?: number;
    scale?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  }

  export interface QRCodeToDataURLOptions extends QRCodeToCanvasOptions {
    type?: "image/png" | "image/jpeg" | "image/webp";
    rendererOpts?: {
      quality?: number;
    };
  }

  function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: QRCodeToCanvasOptions
  ): Promise<HTMLCanvasElement>;

  function toDataURL(
    text: string,
    options?: QRCodeToDataURLOptions
  ): Promise<string>;

  function toString(
    text: string,
    options?: QRCodeToCanvasOptions
  ): Promise<string>;

  const QRCode: {
    toCanvas: typeof toCanvas;
    toDataURL: typeof toDataURL;
    toString: typeof toString;
  };

  export default QRCode;
}