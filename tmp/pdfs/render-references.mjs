import fs from 'node:fs/promises';
import path from 'node:path';
import { getDocument } from 'file:///C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pdfjs-dist/legacy/build/pdf.mjs';
import canvasPackage from 'file:///C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas/index.js';

const { createCanvas, DOMMatrix, ImageData, Path2D } = canvasPackage;
globalThis.DOMMatrix ??= DOMMatrix;
globalThis.ImageData ??= ImageData;
globalThis.Path2D ??= Path2D;

const [input, output] = process.argv.slice(2);
await fs.mkdir(output, { recursive: true });
const data = new Uint8Array(await fs.readFile(input));
const document = await getDocument({ data }).promise;
const text = [];

for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 0.7 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext('2d');
  await page.render({ canvasContext: context, viewport }).promise;
  const filename = `page-${String(pageNumber).padStart(2, '0')}.png`;
  await fs.writeFile(path.join(output, filename), canvas.toBuffer('image/png'));
  const content = await page.getTextContent();
  text.push(`--- PAGE ${pageNumber} ---\n${content.items.map((item) => item.str).join(' ')}`);
}

await fs.writeFile(path.join(output, 'text.txt'), text.join('\n\n'), 'utf8');
console.log(JSON.stringify({ pages: document.numPages, output }));
