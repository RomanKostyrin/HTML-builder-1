const fs = require('fs');
const { mkdir, readdir } = require('fs').promises;
const path = require('path');
const pathToFolder = path.join(__dirname, 'project-dist');

async function getData() {
  try {
    const data = [];
    const pathToFiles = path.join(__dirname, 'styles');

    const writeableStream = fs.createWriteStream(path.join(pathToFolder, 'bundle.css'));
    const files = await readdir(pathToFiles, {
      withFileTypes: true,
    });
    for (const file of files) {
      const pathToFile = path.join(pathToFiles, file.name);
      const readableStream = fs.createReadStream(pathToFile, 'utf8');
      const f = path.parse(pathToFile);
      if (file.isFile() && f.ext.slice(1) === 'css') {
        for await (const chunk of readableStream) {
          data.push(chunk);
        }
      }
    }
    for (const row of data) {
      writeableStream.write(row);
    }
  } catch (err) {
    console.error(err);
  }
}

async function makeDir() {
  try {
    console.log('create directory project-dist...');
    console.log('---------------------------');
    await mkdir(pathToFolder, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}

async function makeFile() {
  try {
    console.log('create file bundle.css...');
    console.log('---------------------------');
    fs.appendFile(path.join(pathToFolder, 'bundle.css'), '', function (err) {
      if (err) throw err;
    });
  } catch (err) {
    console.error(err);
  }
}

async function startApp() {
  await makeDir();
  await makeFile();
  await getData();
}

startApp();
