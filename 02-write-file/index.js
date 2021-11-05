const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Здравствуйте введите текст : ');
stdin.on('data',  chunk => output.write(chunk));
process.on('SIGINT', () => { stdout.write('Файл записан, удачи !'); process.exit(); });