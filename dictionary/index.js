const parse = require('csv-parse/lib/sync')
const fs = require('fs')

let lines = fs.readFileSync('words.csv', 'utf-8');

const records = parse(lines, {
    columns: true,
    skip_empty_lines: true
})

fs.writeFileSync('words.json', JSON.stringify(records));