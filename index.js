const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const [command, title, content] = process.argv.slice(2);

switch (command) {
  case 'list':
    list();
    break;
  case 'view':
    view(title);
    break;
  case 'create':
    create(title, content);
    break;
  case 'remove':
    remove(title);
    break;
  default:
    console.log('Неизвестная команда');
}

function init() {
  if (path.join(__dirname, 'notes.json')) {
    console.log('Файл notes.json существует');
  } else {
    fs.writeFile(path.join(__dirname, 'notes.json'), '[]', (err) => {
      if (err) throw err;
      console.log('Файл notes.json был создан');
    });
  }
}

function create(title, content) {
  init();
  fs.readFile('notes.json', (error, data) => {
    if (error) return console.error(error.message);
    const notes = JSON.parse(data);
    notes.push({ title, content });
    const json = JSON.stringify(notes);

    fs.writeFile('notes.json', json, (error) => {
      if (error) return console.error(error.message);
      console.log('Заметка создана');
    });
  });
}

function list() {
  fs.readFile('notes.json', (error, data) => {
    if (error) return console.error(error.message);
    const notes = JSON.parse(data);
    notes.forEach((note, index) => console.log(`${index + 1} ${note.title}`));
  });
}

function view(title) {
  fs.readFile('notes.json', (error, data) => {
    if (error) return console.error(error.message);
    const notes = JSON.parse(data);
    const note = notes.find((note) => note.title === title);
    if (!note) {
      console.log('Заметка не найдена');
      return;
    } else {
      console.log(note.content);
    }
  });
}

function remove(title) {
  fs.readFile('notes.json', (error, data) => {
    if (error) return console.error(error.message);
    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.title !== title);
    const json = JSON.stringify(notes);
    fs.writeFile('notes.json', json, (error) => {
      if (error) return console.error(error.message);
      console.log('Заметка удалена');
    });
  });
}