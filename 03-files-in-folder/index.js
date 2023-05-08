const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

function showInfo(file) {
  fs.stat(path.join(dirPath, file.name),
    (error, stats) => {
      if (!error) {
        const info = path.parse(file.name);
        console.log(`${info.name} - ${info.ext.slice(1)} - ${stats.size} bytes`);
      } else {
        console.log(error);
      }
    });
}

fs.readdir(dirPath, {withFileTypes: true},
  (error, files) => {
    if (error) {
      console.log(error);
    } else {
      files.forEach(file => {
        if (file.isFile()) {
          showInfo(file);
        }
      });
    }
  });