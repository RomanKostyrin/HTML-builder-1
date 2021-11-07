const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let writeableStream = fs.createWriteStream(path.join(__dirname, 'hello.txt'));

console.log('Write your text for store in the file: ');

rl.on('line', (message) => {
  writeToFile(message);
});

process.on('beforeExit', () => sayGoodbuy());

function sayGoodbuy() {
  console.log('Have a good day!!!');
}

function writeToFile(message) {
  if (message === 'exit') {
    sayGoodbuy();
    process.exit();
  }
  writeableStream.write(`${message} \n`);
}
