const { mkdir, copyFile, readdir, rm } = require('fs').promises;
const path = require('path');

async function getFiles() {
  try {
    const pathToFiles = path.join(__dirname, 'files');
    const pathToFilesCopy = path.join(__dirname, 'files-copy');
    const files = await readdir(pathToFiles, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(pathToFiles, file.name);
        const pathToFileCopy = path.join(pathToFilesCopy, file.name);
        await copyFile(pathToFile, pathToFileCopy);
        console.log('copying file:', file.name);
        console.log('---------------------------');
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function makeDir() {
  try {
    await rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true });
    console.log('create directory files-copy...');
    console.log('---------------------------');
    await mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
  } catch (err) {
    console.error(err);
  }
}

async function startApp() {
  await makeDir();
  await getFiles();
}
startApp();
