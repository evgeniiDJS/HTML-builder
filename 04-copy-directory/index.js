const fs = require('fs');
const path = require('path');

copyDir( path.resolve(__dirname, 'files'), path.resolve(__dirname, 'files-copy') );

async function copyDir(src, dest) {
  fs.access(dest, fs.constants.F_OK, async () => {
    
    await fs.promises.mkdir(dest);

    const files = await fs.promises.readdir(src);
    files.forEach(async (file) => {
      const fileCopy = path.resolve(dest, file);
      file = path.resolve(src, file);

      const stats = await fs.promises.stat(file);

      if (stats.isFile()) {
        await fs.promises.copyFile(file, fileCopy);
      } else if (stats.isDirectory()) {
        await fs.promises.mkdir(fileCopy, { recursive: true });
        await copyDir(file, fileCopy);
      }
    });
  });
}