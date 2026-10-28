const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pickRecordedVideo } = require('./record-cover-video');

function tmpCoversDir(files) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'covers-'));
    for (const f of files) fs.writeFileSync(path.join(dir, f), '');
    return dir;
}

test('picks the newly recorded webm, not a pre-existing cover video', () => {
    const dir = tmpCoversDir(['cover-autonomous-agents.webm', 'cover-red-queen.webm']);
    const before = fs.readdirSync(dir);
    fs.writeFileSync(path.join(dir, 'fb79af143358d56de50f11867946c3b2.webm'), '');

    const picked = pickRecordedVideo(dir, before);

    assert.equal(path.basename(picked), 'fb79af143358d56de50f11867946c3b2.webm');
});

test('throws instead of consuming an existing cover when nothing new was recorded', () => {
    const dir = tmpCoversDir(['cover-autonomous-agents.webm']);
    const before = fs.readdirSync(dir);

    assert.throws(() => pickRecordedVideo(dir, before), /No video file was recorded/);
    assert.ok(fs.existsSync(path.join(dir, 'cover-autonomous-agents.webm')));
});
