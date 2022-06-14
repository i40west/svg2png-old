
import { initialize, svg2png } from 'svg2png-wasm';
import wasm from '../node_modules/svg2png-wasm/svg2png_wasm_bg.wasm';

const svgtext = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>`;

initialize(wasm).catch(() => {});

export default {
    async fetch(request) {
        const { headers } = request;

        if (request.method !== 'POST') {
            const buf = await svg2png(svgtext, {});
            return new Response(buf, { headers: { 'content-type': 'image/png' } });
        }

        const contentType = headers.get('content-type') || '';
        if (!contentType.includes('image/svg+xml')) {
            return new Response('bad request content-type', { status: 400 });
        }
        const svg = await request.text();
        const buf = await svg2png(svg, {});
        return new Response(buf, { headers: { 'content-type': 'image/png' } });
    },
};
