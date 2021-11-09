const path = require('path');
const fs = require('fs');

const src = path.resolve(__dirname, 'styles');
const dist = path.resolve(__dirname, 'project-dist');
const bundle = path.resolve(dist, 'bundle.css');

fs.access(bundle, fs.constants.F_OK, async (err) => {
  if (!err) await fs.promises.rm(bundle);
});

mergeStyles(src, dist);

async function mergeStyles(src, dist) {
  await fs.promises.mkdir(dist, { recursive: true });

  const files = await fs.promises.readdir(src);

  for (let file of files) {
    file = path.resolve(src, file);
    const stats = await fs.promises.stat(file);

    if (stats.isFile && path.extname(file) === '.css') {
      const wPromise = new Promise((res) => {
        const rStream = fs.createReadStream(file);
        const wStream = fs.createWriteStream(bundle, {
          flags: 'a',
        });
        rStream.pipe(wStream);
        rStream.on('end', () => res());
      });
      await wPromise;
    }
  }
}