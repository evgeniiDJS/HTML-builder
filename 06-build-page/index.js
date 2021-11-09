const path = require('path');
const fs = require('fs');

const dist = path.resolve(__dirname, 'project-dist');

(async () => {
  try {
    await fs.promises.access(dist, fs.constants.F_OK);
    await fs.promises.rm(dist, { recursive: true, force: true });
  } catch(err) {
    console.log(err);
  } finally {
    build(dist);
  }
})();

function build(dist) {
  buildPage(dist);
  mergeStyles(path.resolve(__dirname, 'styles'), dist);
  copyAssets(path.resolve(__dirname, 'assets'), path.resolve(dist, 'assets'));
}

async function buildPage(dist) {
  await fs.promises.mkdir(dist, { recursive: true });

  let template = await fs.promises.readFile( path.resolve(__dirname, 'template.html') );
  
  template = template.toString();

  const components = template.match(/(?<=\{\{).+(?=\}\})/g);

  for (let component of components) {
    const comp = await fs.promises.readFile(
      path.resolve(__dirname, 'components', component + '.html')
    );
    template = template.replace(`{{${component}}}`, comp);
  }

  await fs.promises.writeFile(path.resolve(dist, 'index.html'), template);
}

async function mergeStyles(src, dist) {
  await fs.promises.mkdir(dist, { recursive: true });

  const files = await fs.promises.readdir(src);

  for (let file of files) {
    file = path.resolve(src, file);
    const stats = await fs.promises.stat(file);

    if (stats.isFile && path.extname(file) === '.css') {
      const writePromise = new Promise((res) => {
        const rStream = fs.createReadStream(file);
        const wStream = fs.createWriteStream(path.resolve(dist, 'style.css'), { flags: 'a', });
        rStream.pipe(wStream);
        rStream.on('end', () => res());
      });
      await writePromise;
    }
  }
}

async function copyAssets(src, dist) {
  await fs.promises.mkdir(dist, { recursive: true });

  const files = await fs.promises.readdir(src);
  files.forEach(async (file) => {
    const fileCopy = path.resolve(dist, file);
    file = path.resolve(src, file);

    const stats = await fs.promises.stat(file);

    if (stats.isFile()) {
      await fs.promises.copyFile(file, fileCopy);
    } else if (stats.isDirectory()) {
      await fs.promises.mkdir(fileCopy, { recursive: true });
      await copyAssets(file, fileCopy);
    }
  });
}