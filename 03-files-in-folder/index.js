const { readdir } = require('fs').promises;
const { stat } = require('fs');
const path = require('path');

async function getFiles() {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(__dirname, `secret-folder/${file.name}`);
        const f = path.parse(pathToFile);
        await stat(pathToFile, async (err, stats) => {
          console.log(`${f.name} - ${f.ext.slice(1)} - ${stats.size / 1024} kb`);
          console.log('---------------------------');
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

console.log('Files in the secret-folder: ');
console.log('---------------------------');
getFiles();
