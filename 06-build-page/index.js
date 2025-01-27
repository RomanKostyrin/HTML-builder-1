const fs = require('fs');
const { mkdir, readdir, copyFile } = require('fs').promises;
const path = require('path');
const pathToFolder = path.join(__dirname, 'project-dist');
async function makeDir() {
  try {
    console.log('create directory project-dist...');
    console.log('---------------------------');
    await mkdir(pathToFolder, { recursive: true });
    console.log('create directory assets...');
    console.log('---------------------------');
    await mkdir(path.join(pathToFolder, 'assets'), {
      recursive: true,
    });
  } catch (err) {
    console.error(err);
  }
}

async function makeFile() {
  try {
    console.log('create file style.css...');
    console.log('---------------------------');
    await fs.appendFile(path.join(pathToFolder, 'style.css'), '', function (err) {
      if (err) throw err;
    });
    console.log('create file index.html...');
    console.log('---------------------------');
    await fs.appendFile(path.join(pathToFolder, 'index.html'), '', function (err) {
      if (err) throw err;
    });
  } catch (err) {
    console.error(err);
  }
}

async function getDataToCss() {
  try {
    const data = [];
    const pathToFiles = path.join(__dirname, 'styles');

    const writeableStream = fs.createWriteStream(path.join(pathToFolder, 'style.css'));
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
    console.log('DONE!!!');
  } catch (err) {
    console.error(err);
  }
}

async function getDataToHtml() {
  try {
    let data = '';
    const pathToFiles = path.join(__dirname, 'components');

    const pathToFile = path.join(__dirname, 'template.html');
    const readableHtmlStream = fs.createReadStream(pathToFile, 'utf8');
    for await (const chunk of readableHtmlStream) {
      data += chunk;
    }

    const writeableStream = fs.createWriteStream(path.join(pathToFolder, 'index.html'));
    const files = await readdir(pathToFiles, {
      withFileTypes: true,
    });
    for (const file of files) {
      let fileData = '';
      const pathToFile = path.join(pathToFiles, file.name);
      const readableStream = fs.createReadStream(pathToFile, 'utf8');
      const f = path.parse(pathToFile);
      if (file.isFile() && f.ext.slice(1) === 'html') {
        for await (const chunk of readableStream) {
          fileData += chunk;
        }
      }
      data = data.replace(`{{${f.name}}}`, fileData);
    }
    writeableStream.write(data);
  } catch (err) {
    console.error(err);
  }
}

async function copyFiles() {
  try {
    const pathToFiles = path.join(__dirname, 'assets');
    const pathToFilesCopy = path.join(pathToFolder, 'assets');
    const folders = await readdir(pathToFiles);
    for (const folder of folders) {
      const pathToFolder = path.join(pathToFiles, folder);
      const pathToFolderCopy = path.join(pathToFilesCopy, folder);
      await mkdir(pathToFolderCopy, { recursive: true });
      const files = await readdir(pathToFolder);
      for (const file of files) {
        const pathToFile = path.join(pathToFolder, file);
        const pathToFileCopy = path.join(pathToFolderCopy, file);
        await copyFile(pathToFile, pathToFileCopy);
        console.log('copying file:', file);
        console.log('---------------------------');
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function go() {
  await makeDir();
  await makeFile();
  await getDataToCss();
  await getDataToHtml();
  await copyFiles();
}

go().catch((err) => console.error(err));
