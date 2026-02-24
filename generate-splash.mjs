/**
 * Generates assets/splash.png — a 2160×3840 (9:16) splash screen for SideQuest.
 * Run with: node generate-splash.mjs
 * Requires: npm install canvas
 */
import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';

const W = 2160;
const H = 3840;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// ── Background (cream) ──────────────────────────────────────
ctx.fillStyle = '#fcfaf2';
ctx.fillRect(0, 0, W, H);

// ── Load the logo ───────────────────────────────────────────
const logo = await loadImage('./assets/logo.png');

const LOGO_SIZE = 420;
const logoX = (W - LOGO_SIZE) / 2;
const logoY = H / 2 - 520;

// Rounded-rect clip for the logo
const r = 80;
ctx.save();
ctx.beginPath();
ctx.moveTo(logoX + r, logoY);
ctx.lineTo(logoX + LOGO_SIZE - r, logoY);
ctx.arcTo(logoX + LOGO_SIZE, logoY, logoX + LOGO_SIZE, logoY + r, r);
ctx.lineTo(logoX + LOGO_SIZE, logoY + LOGO_SIZE - r);
ctx.arcTo(logoX + LOGO_SIZE, logoY + LOGO_SIZE, logoX + LOGO_SIZE - r, logoY + LOGO_SIZE, r);
ctx.lineTo(logoX + r, logoY + LOGO_SIZE);
ctx.arcTo(logoX, logoY + LOGO_SIZE, logoX, logoY + LOGO_SIZE - r, r);
ctx.lineTo(logoX, logoY + r);
ctx.arcTo(logoX, logoY, logoX + r, logoY, r);
ctx.closePath();
ctx.clip();
ctx.drawImage(logo, logoX, logoY, LOGO_SIZE, LOGO_SIZE);
ctx.restore();

// ── Border around the logo ──────────────────────────────────
ctx.save();
ctx.beginPath();
ctx.moveTo(logoX + r, logoY);
ctx.lineTo(logoX + LOGO_SIZE - r, logoY);
ctx.arcTo(logoX + LOGO_SIZE, logoY, logoX + LOGO_SIZE, logoY + r, r);
ctx.lineTo(logoX + LOGO_SIZE, logoY + LOGO_SIZE - r);
ctx.arcTo(logoX + LOGO_SIZE, logoY + LOGO_SIZE, logoX + LOGO_SIZE - r, logoY + LOGO_SIZE, r);
ctx.lineTo(logoX + r, logoY + LOGO_SIZE);
ctx.arcTo(logoX, logoY + LOGO_SIZE, logoX, logoY + LOGO_SIZE - r, r);
ctx.lineTo(logoX, logoY + r);
ctx.arcTo(logoX, logoY, logoX + r, logoY, r);
ctx.closePath();
ctx.strokeStyle = '#1a1a1a';
ctx.lineWidth = 10;
ctx.stroke();
ctx.restore();

// ── App name ────────────────────────────────────────────────
ctx.fillStyle = '#2d2d2d';
ctx.font = 'bold 210px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('SideQuest ✨', W / 2, logoY + LOGO_SIZE + 220);

// ── Tagline ─────────────────────────────────────────────────
ctx.fillStyle = '#6b6560';
ctx.font = '100px sans-serif';
const tagline = 'Tracking the beautifully unhinged side-quests';

// Word-wrap the tagline
const maxWidth = 1700;
const words = tagline.split(' ');
let line = '';
const lines = [];
for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
    } else {
        line = test;
    }
}
if (line) lines.push(line);

const lineHeight = 130;
const taglineStartY = logoY + LOGO_SIZE + 420;
lines.forEach((l, i) => {
    ctx.fillText(l, W / 2, taglineStartY + i * lineHeight);
});

// ── Save ─────────────────────────────────────────────────────
const buffer = canvas.toBuffer('image/png');
writeFileSync('./assets/splash.png', buffer);
console.log('✅  assets/splash.png generated!');
