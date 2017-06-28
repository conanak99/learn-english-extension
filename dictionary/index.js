let fs = require('fs');

let lines = fs.readFileSync('words.csv', 'utf-8').split('\r\n');

let words = lines.map(line => {
    let sections = line.split(',');
    let word = sections[0].trim();
    let type = sections[1].trim();
    let pronounce = sections[2].trim();
    let meaning = sections[sections.length - 1].replace('"','').trim();

    return {
        word, type, pronounce, meaning
    };
});

fs.writeFileSync('words.json', JSON.stringify(words));