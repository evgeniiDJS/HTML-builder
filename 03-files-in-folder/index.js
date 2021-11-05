const path = require('path');
const fs = require('fs');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, ( err, files ) => {
  files.forEach(file => {
    file = path.resolve(secretFolder, file);
    fs.stat(file, (err, status) => {
      if(status.isFile()) {
        const printInf = () => {
          const fileExt = path.extname(file).slice(1);
          const fileName = path.basename(file);
          const fileSize = status.size;
          console.log(`${fileName} - ${fileExt} - ${fileSize} kb`);
        };
        return printInf();
      }
    });
  });
});
