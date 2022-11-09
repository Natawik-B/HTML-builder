const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.txt");
const output = fs.createWriteStream(filePath);

const {stdin, stdout} = process;
stdout.write("Hello! Enter your wishes, please 🐱\n");

stdin.on("data", data => {
  if (data.toString().trim() === "exit") {
    process.exit();
  } else {
    output.write(data);
  }
});

process.on("SIGINT", () => process.exit());
process.on("exit", () => stdout.write("Goodbye, my friend!"));