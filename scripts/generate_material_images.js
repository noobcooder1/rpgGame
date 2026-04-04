const fs = require('fs');
const path = require('path');

const ICON_SIZE = 512;
const CENTER_X = ICON_SIZE / 2;
const CENTER_Y = ICON_SIZE / 2;

const outputDirectory = path.join(process.cwd(), 'assets/items/materials');
fs.mkdirSync(outputDirectory, { recursive: true });

/**
 * 시드 기반 난수 생성기입니다.
 * @param {number} seed
 * @returns {() => number}
 */
function createRng(seed) {
    let state = seed >>> 0;
    return function next() {
        state += 0x6D2B79F5;
        let value = state;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * 범위 난수를 반환합니다.
 * @param {() => number} rng
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function rand(rng, min, max) {
    return min + (max - min) * rng();
}

/**
 * SVG path 숫자 포맷을 통일합니다.
 * @param {number} value
 * @returns {string}
 */
function formatNumber(value) {
    return Number(value).toFixed(1);
}

/**
 * 방사형 불규칙 다각형 점들을 생성합니다.
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 * @param {number} count
 * @param {number} jitter
 * @param {() => number} rng
 * @returns {{x:number,y:number}[]}
 */
function radialPolygon(cx, cy, radius, count, jitter, rng) {
    const points = [];
    const step = (Math.PI * 2) / count;
    const start = rand(rng, -0.4, 0.4);

    for (let i = 0; i < count; i += 1) {
        const angle = start + step * i + rand(rng, -step * jitter, step * jitter);
        const currentRadius = radius * (1 + rand(rng, -jitter, jitter));
        points.push({
            x: cx + Math.cos(angle) * currentRadius,
            y: cy + Math.sin(angle) * currentRadius
        });
    }

    return points;
}

/**
 * 다각형을 중심 기준으로 안쪽으로 축소합니다.
 * @param {{x:number,y:number}[]} points
 * @param {number} cx
 * @param {number} cy
 * @param {number} scale
 * @param {number} jitter
 * @param {() => number} rng
 * @returns {{x:number,y:number}[]}
 */
function insetPolygon(points, cx, cy, scale, jitter, rng) {
    return points.map((point) => ({
        x: cx + (point.x - cx) * scale + rand(rng, -jitter, jitter),
        y: cy + (point.y - cy) * scale + rand(rng, -jitter, jitter)
    }));
}

/**
 * 점 목록을 SVG path 문자열로 변환합니다.
 * @param {{x:number,y:number}[]} points
 * @returns {string}
 */
function pointsToPath(points) {
    return `${points.map((point, index) => `${index === 0 ? 'M' : 'L'}${formatNumber(point.x)} ${formatNumber(point.y)}`).join(' ')} Z`;
}

/**
 * 공통 분위기 필터를 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @returns {string}
 */
function buildBaseDefs(id, seed) {
    return `
    <filter id="drop_${id}" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="20" stdDeviation="14" flood-color="#000000" flood-opacity="0.42"/>
    </filter>
    <filter id="grain_${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="${seed}" result="noise"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.11"/>
      </feComponentTransfer>
    </filter>
    <filter id="surface_${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="${seed + 17}" result="surfaceNoise"/>
      <feDisplacementMap in="SourceGraphic" in2="surfaceNoise" scale="8" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <radialGradient id="rim_${id}" cx="0.35" cy="0.2" r="0.9">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.22"/>
    </radialGradient>`;
}

/**
 * SVG 문서를 감쌉니다.
 * @param {string} id
 * @param {number} seed
 * @param {string} defs
 * @param {string} body
 * @returns {string}
 */
function svgWrap(id, seed, defs, body) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${id} material icon">
  <defs>
    ${buildBaseDefs(id, seed)}
    ${defs}
  </defs>
  <ellipse cx="256" cy="458" rx="146" ry="28" fill="#000000" opacity="0.28"/>
  ${body}
  <rect x="24" y="24" width="464" height="464" filter="url(#grain_${id})"/>
</svg>`;
}

/**
 * 광물/돌류 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string,string?]} colors
 * @returns {string}
 */
function rockSvg(id, seed, colors) {
    const rng = createRng(seed);
    const outer = radialPolygon(CENTER_X, CENTER_Y + rand(rng, 8, 20), rand(rng, 156, 172), 12, 0.24, rng);
    const inner = insetPolygon(outer, CENTER_X, CENTER_Y, 0.72, 9, rng);

    let facets = '';
    for (let i = 0; i < outer.length; i += 1) {
        const pointA = outer[i];
        const pointB = outer[(i + 1) % outer.length];
        const centerOffsetX = CENTER_X + rand(rng, -18, 18);
        const centerOffsetY = CENTER_Y + rand(rng, -20, 16);
        const alpha = rand(rng, 0.06, 0.2);
        facets += `<path d="M${formatNumber(centerOffsetX)} ${formatNumber(centerOffsetY)} L${formatNumber(pointA.x)} ${formatNumber(pointA.y)} L${formatNumber(pointB.x)} ${formatNumber(pointB.y)} Z" fill="#ffffff" opacity="${alpha.toFixed(3)}"/>`;
    }

    let cracks = '';
    for (let i = 0; i < 5; i += 1) {
        const start = outer[Math.floor(rand(rng, 0, outer.length))];
        const end = inner[Math.floor(rand(rng, 0, inner.length))];
        const ctrlX = (start.x + end.x) / 2 + rand(rng, -18, 18);
        const ctrlY = (start.y + end.y) / 2 + rand(rng, -18, 18);
        cracks += `<path d="M${formatNumber(start.x)} ${formatNumber(start.y)} Q${formatNumber(ctrlX)} ${formatNumber(ctrlY)} ${formatNumber(end.x)} ${formatNumber(end.y)}" stroke="#0a0a0a" stroke-opacity="0.28" stroke-width="6" stroke-linecap="round" fill="none"/>`;
    }

    let specks = '';
    const fleck = colors[3] || '#f4f5f8';
    for (let i = 0; i < 18; i += 1) {
        const x = rand(rng, 138, 374);
        const y = rand(rng, 130, 370);
        const radius = rand(rng, 4, 10);
        const opacity = rand(rng, 0.16, 0.45);
        specks += `<circle cx="${formatNumber(x)}" cy="${formatNumber(y)}" r="${formatNumber(radius)}" fill="${fleck}" opacity="${opacity.toFixed(3)}"/>`;
    }

    const defs = `
    <linearGradient id="base_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="55%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>
    <linearGradient id="inner_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/>
    </linearGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <path d="${pointsToPath(outer)}" fill="url(#base_${id})" stroke="#121212" stroke-opacity="0.55" stroke-width="8"/>
    <path d="${pointsToPath(inner)}" fill="url(#inner_${id})"/>
    <path d="${pointsToPath(inner)}" fill="url(#rim_${id})" opacity="0.45"/>
    ${facets}
    ${cracks}
    ${specks}
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 보석/결정 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string,string?]} colors
 * @returns {string}
 */
function crystalSvg(id, seed, colors) {
    const rng = createRng(seed);
    const outer = radialPolygon(CENTER_X, CENTER_Y + rand(rng, 0, 8), rand(rng, 156, 176), 8, 0.12, rng);
    const core = {
        x: CENTER_X + rand(rng, -22, 22),
        y: CENTER_Y + rand(rng, -18, 20)
    };

    let facets = '';
    for (let i = 0; i < outer.length; i += 1) {
        const pointA = outer[i];
        const pointB = outer[(i + 1) % outer.length];
        const mixX = (pointA.x + pointB.x) / 2 + rand(rng, -12, 12);
        const mixY = (pointA.y + pointB.y) / 2 + rand(rng, -12, 12);
        const opacityA = rand(rng, 0.16, 0.38);
        const opacityB = rand(rng, 0.08, 0.2);

        facets += `<path d="M${formatNumber(core.x)} ${formatNumber(core.y)} L${formatNumber(pointA.x)} ${formatNumber(pointA.y)} L${formatNumber(mixX)} ${formatNumber(mixY)} Z" fill="#ffffff" opacity="${opacityA.toFixed(3)}"/>`;
        facets += `<path d="M${formatNumber(core.x)} ${formatNumber(core.y)} L${formatNumber(mixX)} ${formatNumber(mixY)} L${formatNumber(pointB.x)} ${formatNumber(pointB.y)} Z" fill="#000000" opacity="${opacityB.toFixed(3)}"/>`;
    }

    let glints = '';
    for (let i = 0; i < 7; i += 1) {
        const gx = rand(rng, 168, 344);
        const gy = rand(rng, 126, 312);
        const radius = rand(rng, 4, 11);
        const opacity = rand(rng, 0.2, 0.45);
        glints += `<circle cx="${formatNumber(gx)}" cy="${formatNumber(gy)}" r="${formatNumber(radius)}" fill="#ffffff" opacity="${opacity.toFixed(3)}"/>`;
    }

    const defs = `
    <linearGradient id="base_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="45%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>
    <radialGradient id="glow_${id}" cx="0.4" cy="0.28" r="0.8">
      <stop offset="0%" stop-color="${colors[3] || '#ffffff'}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <path d="${pointsToPath(outer)}" fill="url(#base_${id})" stroke="#0f1320" stroke-opacity="0.65" stroke-width="8"/>
    <path d="${pointsToPath(outer)}" fill="url(#glow_${id})"/>
    ${facets}
    ${glints}
    <path d="${pointsToPath(insetPolygon(outer, CENTER_X, CENTER_Y, 0.74, 7, rng))}" fill="url(#rim_${id})" opacity="0.38"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 잎/약초 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function leafClusterSvg(id, seed, colors) {
    const rng = createRng(seed);
    const leaves = [
        { cx: 206, cy: 244, rx: 62, ry: 144, angle: rand(rng, -34, -22), fill: `url(#leafA_${id})` },
        { cx: 298, cy: 238, rx: 66, ry: 148, angle: rand(rng, 18, 32), fill: `url(#leafB_${id})` },
        { cx: 256, cy: 286, rx: 74, ry: 134, angle: rand(rng, -8, 8), fill: `url(#leafC_${id})` }
    ];

    let leafMarkup = '';
    leaves.forEach((leaf, index) => {
        leafMarkup += `<ellipse cx="${formatNumber(leaf.cx)}" cy="${formatNumber(leaf.cy)}" rx="${formatNumber(leaf.rx)}" ry="${formatNumber(leaf.ry)}" transform="rotate(${formatNumber(leaf.angle)} ${formatNumber(leaf.cx)} ${formatNumber(leaf.cy)})" fill="${leaf.fill}" stroke="#102915" stroke-opacity="0.55" stroke-width="6"/>`;
        leafMarkup += `<path d="M${formatNumber(leaf.cx)} ${formatNumber(leaf.cy - leaf.ry + 26)} Q${formatNumber(leaf.cx + rand(rng, -16, 16))} ${formatNumber(leaf.cy)} ${formatNumber(leaf.cx + rand(rng, -12, 12))} ${formatNumber(leaf.cy + leaf.ry - 24)}" stroke="#d8ffd9" stroke-opacity="0.34" stroke-width="5" fill="none"/>`;

        for (let i = 0; i < 4; i += 1) {
            const veinY = rand(rng, leaf.cy - 80, leaf.cy + 90);
            const direction = index % 2 === 0 ? 1 : -1;
            const x1 = leaf.cx;
            const x2 = leaf.cx + direction * rand(rng, 32, 62);
            const y2 = veinY + rand(rng, -24, 24);
            leafMarkup += `<path d="M${formatNumber(x1)} ${formatNumber(veinY)} Q${formatNumber((x1 + x2) / 2)} ${formatNumber((veinY + y2) / 2)} ${formatNumber(x2)} ${formatNumber(y2)}" stroke="#d9ffd6" stroke-opacity="0.22" stroke-width="4" fill="none"/>`;
        }
    });

    const defs = `
    <linearGradient id="leafA_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="100%" stop-color="${colors[1]}"/>
    </linearGradient>
    <linearGradient id="leafB_${id}" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>
    <linearGradient id="leafC_${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>
    <linearGradient id="stem_${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7f5b3d"/>
      <stop offset="100%" stop-color="#3e2717"/>
    </linearGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <path d="M256 456C258 412 262 362 270 318" stroke="url(#stem_${id})" stroke-width="16" stroke-linecap="round"/>
    ${leafMarkup}
    <path d="M188 410C234 400 278 398 326 408" stroke="#0f2812" stroke-opacity="0.32" stroke-width="8" stroke-linecap="round"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 천 조각 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function clothPatchSvg(id, seed, colors) {
    const rng = createRng(seed);
    const clothOuter = radialPolygon(CENTER_X, CENTER_Y + 6, 170, 11, 0.28, rng);
    const clothInner = insetPolygon(clothOuter, CENTER_X, CENTER_Y, 0.87, 7, rng);

    let folds = '';
    for (let i = 0; i < 7; i += 1) {
        const y = rand(rng, 156, 356);
        const xStart = rand(rng, 96, 136);
        const xEnd = rand(rng, 362, 416);
        folds += `<path d="M${formatNumber(xStart)} ${formatNumber(y)} Q256 ${formatNumber(y + rand(rng, -22, 22))} ${formatNumber(xEnd)} ${formatNumber(y + rand(rng, -14, 14))}" stroke="#1d1410" stroke-opacity="0.24" stroke-width="7" fill="none"/>`;
    }

    let stitches = '';
    for (let i = 0; i < clothOuter.length; i += 1) {
        const point = clothOuter[i];
        stitches += `<circle cx="${formatNumber(point.x)}" cy="${formatNumber(point.y)}" r="3.2" fill="#efe6d7" opacity="0.85"/>`;
    }

    const defs = `
    <linearGradient id="cloth_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="55%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>
    <radialGradient id="clothShine_${id}" cx="0.3" cy="0.2" r="0.9">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <path d="${pointsToPath(clothOuter)}" fill="url(#cloth_${id})" stroke="#1a1410" stroke-opacity="0.55" stroke-width="8"/>
    <path d="${pointsToPath(clothInner)}" fill="url(#clothShine_${id})"/>
    ${folds}
    ${stitches}
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 나무 조각 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function woodLogSvg(id, seed, colors) {
    const rng = createRng(seed);
    let barkLines = '';

    for (let i = 0; i < 10; i += 1) {
        const y = rand(rng, 186, 338);
        barkLines += `<path d="M${formatNumber(rand(rng, 102, 128))} ${formatNumber(y)} C${formatNumber(rand(rng, 178, 204))} ${formatNumber(y + rand(rng, -18, 18))} ${formatNumber(rand(rng, 286, 332))} ${formatNumber(y + rand(rng, -16, 16))} ${formatNumber(rand(rng, 382, 408))} ${formatNumber(y)}" stroke="#25160d" stroke-opacity="0.32" stroke-width="6" fill="none"/>`;
    }

    const defs = `
    <linearGradient id="wood_${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="55%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>
    <radialGradient id="ring_${id}" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0%" stop-color="#8f633e"/>
      <stop offset="100%" stop-color="#5a371f"/>
    </radialGradient>`;

    const body = `
  <g filter="url(#drop_${id})" transform="rotate(-8 256 256)">
    <rect x="104" y="160" width="304" height="184" rx="60" fill="url(#wood_${id})" stroke="#2d1a0f" stroke-opacity="0.62" stroke-width="8"/>
    <ellipse cx="120" cy="252" rx="54" ry="92" fill="url(#ring_${id})"/>
    <ellipse cx="120" cy="252" rx="38" ry="64" fill="none" stroke="#6e4428" stroke-width="7"/>
    <ellipse cx="120" cy="252" rx="22" ry="40" fill="none" stroke="#5a351d" stroke-width="6"/>
    ${barkLines}
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 금속 주괴 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function ingotSvg(id, seed, colors) {
    const defs = `
    <linearGradient id="top_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.54"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="front_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="52%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <path d="M118 284L170 176H344L396 284L360 358H152Z" fill="url(#front_${id})" stroke="#20130d" stroke-opacity="0.62" stroke-width="8"/>
    <path d="M170 176L196 138H320L344 176Z" fill="url(#top_${id})"/>
    <path d="M140 284H374" stroke="#000000" stroke-opacity="0.24" stroke-width="8"/>
    <path d="M174 332C226 344 286 344 336 332" stroke="#ffffff" stroke-opacity="0.2" stroke-width="6" stroke-linecap="round"/>
    <path d="M186 208C236 196 282 194 326 204" stroke="#ffffff" stroke-opacity="0.23" stroke-width="6" stroke-linecap="round"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 송곳니 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function toothSvg(id, seed, colors) {
    const defs = `
    <linearGradient id="tooth_${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="52%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <path d="M264 74C358 108 412 184 400 286C386 378 336 444 256 466C176 446 126 376 112 286C100 184 154 106 264 74Z" fill="url(#tooth_${id})" stroke="#322920" stroke-opacity="0.58" stroke-width="8"/>
    <path d="M256 132C316 148 350 198 344 276C338 344 304 394 256 414" stroke="#7f6a56" stroke-opacity="0.68" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M188 156C156 192 144 236 152 286" stroke="#ffffff" stroke-opacity="0.3" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 날개 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function wingSvg(id, seed, colors) {
    const defs = `
    <linearGradient id="wing_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="62%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <path d="M78 318C106 214 180 138 292 108C338 96 386 104 422 132C372 160 338 190 310 244C278 308 244 376 168 426C140 386 118 350 78 318Z" fill="url(#wing_${id})" stroke="#17171f" stroke-opacity="0.64" stroke-width="8"/>
    <path d="M146 354C232 304 286 242 322 176" stroke="#ffffff" stroke-opacity="0.28" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M188 388C250 360 296 316 336 246M166 322C210 294 256 246 290 194" stroke="#000000" stroke-opacity="0.3" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 거미줄 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function webSvg(id, seed, colors) {
    const defs = `
    <radialGradient id="webBg_${id}" cx="0.5" cy="0.5" r="0.62">
      <stop offset="0%" stop-color="${colors[0]}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${colors[1]}" stop-opacity="0.84"/>
    </radialGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <circle cx="256" cy="266" r="172" fill="url(#webBg_${id})" stroke="${colors[2]}" stroke-opacity="0.34" stroke-width="6"/>
    <path d="M256 94V438M114 146L398 386M84 266H428M114 386L398 146M176 108L336 424M336 108L176 424" stroke="#f8faff" stroke-opacity="0.64" stroke-width="7" stroke-linecap="round"/>
    <circle cx="256" cy="266" r="122" fill="none" stroke="#eef2ff" stroke-opacity="0.5" stroke-width="6"/>
    <circle cx="256" cy="266" r="84" fill="none" stroke="#eef2ff" stroke-opacity="0.46" stroke-width="6"/>
    <circle cx="256" cy="266" r="42" fill="none" stroke="#eef2ff" stroke-opacity="0.42" stroke-width="6"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 뼈 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function boneSvg(id, seed, colors) {
    const defs = `
    <linearGradient id="bone_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="52%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>`;

    const body = `
  <g filter="url(#drop_${id})" transform="rotate(-18 256 256)">
    <path d="M106 196C106 154 140 124 180 124C212 124 240 144 248 172H340C348 144 376 124 408 124C448 124 480 156 480 196C480 228 460 256 432 268C460 280 480 308 480 340C480 386 444 424 398 424C366 424 338 404 330 376H234C226 404 198 424 166 424C120 424 84 386 84 340C84 308 104 280 132 268C114 256 106 228 106 196Z" fill="url(#bone_${id})" stroke="#2f2720" stroke-opacity="0.58" stroke-width="8"/>
    <path d="M210 244H364M210 300H364" stroke="#7f7469" stroke-opacity="0.4" stroke-width="8"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 살점 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function fleshSvg(id, seed, colors) {
    const defs = `
    <radialGradient id="flesh_${id}" cx="0.35" cy="0.2" r="0.8">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="55%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </radialGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <path d="M114 370C74 316 78 242 122 192C174 132 252 98 328 110C388 118 432 154 440 214C448 282 404 330 370 370C326 422 246 458 186 442C150 430 132 402 114 370Z" fill="url(#flesh_${id})" stroke="#3b1717" stroke-opacity="0.62" stroke-width="8"/>
    <path d="M170 188C224 206 270 236 314 276M202 366C246 352 292 344 356 348" stroke="#ffffff" stroke-opacity="0.2" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M144 324C188 286 238 258 298 242" stroke="#000000" stroke-opacity="0.22" stroke-width="8" stroke-linecap="round" fill="none"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 귀 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function earSvg(id, seed, colors) {
    const defs = `
    <linearGradient id="ear_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="54%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>`;

    const body = `
  <g filter="url(#drop_${id})" transform="rotate(-14 256 256)">
    <path d="M236 68C328 78 398 150 406 246C414 342 366 430 274 438C204 442 148 386 140 318C132 254 160 206 186 182C214 158 240 150 256 162C272 174 272 206 252 230C228 258 216 286 220 314C224 346 250 362 280 354C322 342 342 294 334 242C322 182 282 146 236 130Z" fill="url(#ear_${id})" stroke="#3a1f1f" stroke-opacity="0.58" stroke-width="8"/>
    <path d="M252 194C224 224 208 266 216 304C224 340 256 356 292 340" stroke="#7a3434" stroke-opacity="0.58" stroke-width="8" stroke-linecap="round" fill="none"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

/**
 * 약병 아이콘을 생성합니다.
 * @param {string} id
 * @param {number} seed
 * @param {[string,string,string]} colors
 * @returns {string}
 */
function vialSvg(id, seed, colors) {
    const defs = `
    <linearGradient id="glass_${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e9f6ff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.16"/>
    </linearGradient>
    <linearGradient id="liquid_${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors[0]}" stop-opacity="0.9"/>
      <stop offset="55%" stop-color="${colors[1]}" stop-opacity="0.94"/>
      <stop offset="100%" stop-color="${colors[2]}" stop-opacity="0.98"/>
    </linearGradient>`;

    const body = `
  <g filter="url(#drop_${id})">
    <rect x="212" y="78" width="88" height="62" rx="16" fill="#7c5634"/>
    <path d="M188 130H324L370 206V366C370 406 338 438 298 438H214C174 438 142 406 142 366V206Z" fill="url(#glass_${id})" stroke="#b0bac4" stroke-opacity="0.58" stroke-width="8"/>
    <path d="M152 290H360V372C360 404 334 430 302 430H210C178 430 152 404 152 372Z" fill="url(#liquid_${id})"/>
    <path d="M170 176C198 164 244 160 320 170" stroke="#ffffff" stroke-opacity="0.42" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M182 302C226 312 276 312 330 302" stroke="#ffffff" stroke-opacity="0.24" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>`;

    return svgWrap(id, seed, defs, body);
}

const materialRenderers = {
    herb: () => leafClusterSvg('herb', 101, ['#91c66e', '#4f8f42', '#2e5d31']),
    crude_grass: () => leafClusterSvg('crude_grass', 103, ['#9acb74', '#5a9346', '#355f34']),
    grass: () => leafClusterSvg('grass', 105, ['#a9cf70', '#6ca44f', '#406736']),
    herb_material: () => leafClusterSvg('herb_material', 107, ['#8abf76', '#4f8f54', '#2f6340']),
    old_weed: () => leafClusterSvg('old_weed', 109, ['#a1a86e', '#6a7347', '#4f5b39']),

    old_cloth_scrap: () => clothPatchSvg('old_cloth_scrap', 121, ['#cdb18f', '#9e8266', '#6f5a47']),
    old_cloth_piece: () => clothPatchSvg('old_cloth_piece', 123, ['#c8a98b', '#97785f', '#664f3f']),

    wood_piece: () => woodLogSvg('wood_piece', 131, ['#ba7d4e', '#8c5632', '#5f381f']),

    metal_piece: () => rockSvg('metal_piece', 141, ['#c4ccd6', '#7f8b9a', '#4b5562', '#d7e5f6']),
    rusty_scrap: () => rockSvg('rusty_scrap', 143, ['#b07755', '#7d5239', '#4c2f26', '#e3a577']),
    copper_ingot: () => ingotSvg('copper_ingot', 145, ['#f19a58', '#c96e3a', '#7f4728']),

    monster_tooth: () => toothSvg('monster_tooth', 151, ['#f8efd9', '#dbc5a1', '#b59670']),
    troll_tooth: () => toothSvg('troll_tooth', 153, ['#fff4dc', '#e4cba6', '#b9986f']),

    bat_wing: () => wingSvg('bat_wing', 161, ['#6d6778', '#403d4a', '#1d1c27']),
    spider_silk: () => webSvg('spider_silk', 163, ['#f8faff', '#d9dde7', '#f0f2f8']),

    strange_bone: () => boneSvg('strange_bone', 171, ['#f0e7db', '#d6c9b7', '#b6a896']),
    cursed_bone: () => boneSvg('cursed_bone', 173, ['#ddd8e8', '#a9a3bc', '#6e6783']),

    rotten_flesh: () => fleshSvg('rotten_flesh', 181, ['#c36d67', '#844341', '#492829']),
    goblin_ear: () => earSvg('goblin_ear', 183, ['#a8bf80', '#6f8f52', '#4a6338']),

    water: () => vialSvg('water', 191, ['#73d2ff', '#409ccf', '#1f5f8f']),
    troll_blood: () => vialSvg('troll_blood', 193, ['#d73f45', '#8f1e27', '#420b10']),

    stone: () => rockSvg('stone', 201, ['#c2c2c2', '#8f8f8f', '#5c5c5c', '#f0f0f0']),
    coal: () => rockSvg('coal', 203, ['#70727d', '#3d3f49', '#1b1d24', '#b8bdc7']),
    copper_ore: () => rockSvg('copper_ore', 205, ['#d99563', '#9f633f', '#623d2a', '#ffd0ab']),
    iron_ore: () => rockSvg('iron_ore', 207, ['#d6dee8', '#95a0ad', '#616a74', '#f3f7fc']),
    gold_ore: () => rockSvg('gold_ore', 209, ['#ffd35f', '#d39f2f', '#8b6415', '#fff0ae']),
    silver_ore: () => rockSvg('silver_ore', 211, ['#e7edf6', '#b2bbc7', '#7b8490', '#ffffff']),
    mithril_ore: () => rockSvg('mithril_ore', 213, ['#89ecff', '#43a9c2', '#1f6176', '#c7fbff']),
    black_iron_ore: () => rockSvg('black_iron_ore', 215, ['#7c8394', '#4a5061', '#232836', '#d6dcee']),
    mana_stone: () => crystalSvg('mana_stone', 217, ['#77d9ff', '#4674e0', '#1f2d7a', '#c9f5ff']),
    obsidian: () => rockSvg('obsidian', 219, ['#56556a', '#2f2f3c', '#12131b', '#b8b6d1']),

    amethyst: () => crystalSvg('amethyst', 231, ['#d4b4ff', '#8d61d8', '#4b2b89', '#eedcff']),
    ruby: () => crystalSvg('ruby', 233, ['#ff8b94', '#d13a4a', '#6f1422', '#ffd2d7']),
    sapphire: () => crystalSvg('sapphire', 235, ['#8fd1ff', '#3f7be0', '#1b2c75', '#dff1ff']),
    emerald: () => crystalSvg('emerald', 237, ['#9df5b8', '#3eb66e', '#1b6a3c', '#dcffe8']),
    diamond: () => crystalSvg('diamond', 239, ['#f7fcff', '#d4e7f7', '#8ca6bb', '#ffffff']),
    red_crystal: () => crystalSvg('red_crystal', 241, ['#ff9c95', '#dc5254', '#7e2326', '#ffe2df']),
    blue_crystal: () => crystalSvg('blue_crystal', 243, ['#9ad8ff', '#4d8ceb', '#2447a1', '#e3f4ff']),
    green_crystal: () => crystalSvg('green_crystal', 245, ['#a9ffbf', '#4ec579', '#266f45', '#e4ffeb']),
    purple_crystal: () => crystalSvg('purple_crystal', 247, ['#e5bbff', '#9b66da', '#58379a', '#f3ddff'])
};

Object.entries(materialRenderers).forEach(([id, renderer]) => {
    const svg = renderer();
    fs.writeFileSync(path.join(outputDirectory, `${id}.svg`), svg, 'utf8');
});

console.log(`generated ${Object.keys(materialRenderers).length} high-quality material svg files in ${outputDirectory}`);
