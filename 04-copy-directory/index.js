const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'files');
const outputDir = path.join(__dirname, 'files-copy');

fs.mkdir(outputDir, {recursive: true}, errorHandler); 

fs.readdir(inputDir, (err, oldFiles) => { 
  if (err) {
    throw err;
  } else {
    oldFiles.forEach(oldFile => {
      fs.copyFile(path.join(inputDir, oldFile), path.join(outputDir, oldFile), errorHandler);
    });
  }
});

fs.readdir(outputDir, (err, newFiles) => { 
  errorHandler(err);
  fs.readdir(inputDir, (err, oldFiles) => {
    errorHandler(err);
    newFiles.forEach(newFile => {
      if (!oldFiles.includes(newFile)){
        fs.unlink(path.join(outputDir, newFile), errorHandler);
      }});
  });
});

function errorHandler(err) {
  if (err) {
    throw err;
  }
}