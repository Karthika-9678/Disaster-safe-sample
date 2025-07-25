declare module '@mapbox/polyline' {
  const decode: (encoded: string, precision?: number) => Array<[number, number]>;
  const encode: (coordinates: Array<[number, number]>, precision?: number) => string;

  export default {
    decode,
    encode,
  };
}
