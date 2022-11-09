const fs = require("fs");
const path = require("path");

const stylesWay = path.join(__dirname, "styles");
const projectDist = path.join(__dirname, "project-dist");

fs.unlink(path.join(projectDist, "bundle.css"), (err) => {
  if (err) {
    console.log("New file (bundle.css) is created in the Project-dist");
  };
});

fs.readdir(stylesWay, {withFileTypes: true}, (err, allFiles) => {
  if (err) {
    throw err;
  } else {
    allFiles.filter(file => file.isFile() && file.name.split(".").slice(-1) == "css")
            .map(el => el.name)
            .forEach(function(file) {
              let readableStream = fs.createReadStream(path.join(stylesWay, file));
              readableStream.on("data", data => {
                fs.appendFile(path.join(projectDist, "bundle.css"), data, err => {
                  if (err) {
                    throw err;
                  };
                });
              });
            });
  };
});