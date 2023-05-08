const fs = require('fs').promises;
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const htmlPath = path.join(__dirname, 'template.html');
const distAssets = path.join(__dirname, 'project-dist', 'assets');

async function pageAssembly() {
  await fs.mkdir(projectPath, {recursive: true});
  await delDir(projectPath);
  await makeHTML(htmlPath);
  await makeCSS(stylesPath);
  await copyDir(assetsPath, distAssets);
}

async function delDir(source) {
  const files = await fs.readdir(source);
  files.map((file) => fs.rm(path.join(source, file), {recursive: true}));
}

async function copyDir(pathFrom, pathTo) {
  await fs.mkdir(pathTo, {recursive: true});
  const files = await fs.readdir(pathFrom, {withFileTypes: true});
  files.forEach(elem => {
    elem.isFile() ? fs.copyFile(path.join(pathFrom, elem.name) , path.join(pathTo, elem.name)) : copyDir(path.join(pathFrom, elem.name), path.join(pathTo, elem.name));
  });
}

async function readComponents(dir) {
  const files = (await fs.readdir(dir, {withFileTypes: true}))
    .filter(el => el.isFile() && path.extname(el.name).toLowerCase() === '.html')
    .map(file => file.name);
  const contentFile = await Promise.all(files.map(file => fs.readFile(path.join(dir, file), 'utf-8')));
  return files.map((file, j) => ({component: file.split('.')[0], content: contentFile[j]}));
}

async function makeHTML(source) {
  let template = await fs.readFile(source, 'utf-8');
  let contentToReplace = await readComponents(componentsPath);
  let newHTML = contentToReplace.reduce((x, content) => x.replace(`{{${content.component}}}`, content.content), template);
  fs.writeFile(path.join(projectPath, 'index.html'), newHTML);
}

async function makeCSS(source) {
  let styles = await fs.readdir(source);
  styles = await Promise.all(styles.map(file => fs.readFile(path.join(source, file), 'utf-8')));
  await fs.writeFile(path.join(projectPath, 'style.css'), styles.join('\n\n'));
}

pageAssembly();