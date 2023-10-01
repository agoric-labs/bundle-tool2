/* global fetch, DecompressionStream, Response, FileReader */
import ZipLoader from 'https://esm.sh/zip-loader@1.2.0';

export const Browser = {
  toBlob: (base64, type = 'application/octet-stream') =>
    fetch(`data:${type};base64,${base64}`).then(res => res.blob()),
  decompressBlob: async blob => {
    const ds = new DecompressionStream('gzip');
    const decompressedStream = blob.stream().pipeThrough(ds);
    const r = await new Response(decompressedStream).blob();
    return r;
  },
};

const logged = label => x => {
  console.log(label, x);
  return x;
};

export const Cosmos = {
  txURL: (txHash, node = 'devnet.api.agoric.net') =>
    `https://${node}/cosmos/tx/v1beta1/txs/${txHash}`,
  txMessages: (txHash, node = 'devnet.api.agoric.net') =>
    fetch(Cosmos.txURL(txHash, node))
      .then(res => {
        console.log('status', res.status);
        return res.json();
      })
      .then(j => j.tx.body.messages),
};

export const Agoric = {
  getBundle: async msg => {
    if (!('compressed_bundle' in msg)) {
      throw Error('no compressed_bundle - TODO: uncompressed bundle support');
    }
    const { compressed_bundle: b64gzip, uncompressed_size: size } = msg;
    const gzipBlob = await Browser.toBlob(b64gzip);
    const fullText = await Browser.decompressBlob(gzipBlob).then(b => b.text());
    if (fullText.length !== parseInt(size, 10)) {
      throw Error('bundle size mismatch');
    }
    const bundle = JSON.parse(fullText);
    if (!('moduleFormat' in bundle)) {
      throw Error('no moduleFormat');
    }
    return bundle;
  },
  getZipLoader: async bundle => {
    const { moduleFormat } = bundle;
    console.log(moduleFormat, 'TODO: check for endo type');
    const { endoZipBase64 } = bundle;
    const zipBlob = await Browser.toBlob(endoZipBase64);
    return ZipLoader.unzip(zipBlob);
  },
};
