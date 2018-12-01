#!/usr/bin/env node

const fs = require('fs');

const logPath = './out.log';

const logText = `${new Date().toLocaleString()}
${process.argv.map((v, i) => `${i}: ${v}`).join('\n')}
=========================
`;

fs.writeFileSync(logPath, logText);


process.stdin.pipe(fs.createWriteStream(logPath, {
    flags: 'a',
}));

process.stdin.on('data', data => {
    if (data.toString().trim() === 'quit') process.exit();
});


process.stdin.once('data', data => {
    process.stdout.write(data);
});
