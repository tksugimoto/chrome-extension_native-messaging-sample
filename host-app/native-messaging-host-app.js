#!/usr/bin/env node

const fs = require('fs');
const logText = `${new Date().toLocaleString()}
${process.argv.map((v, i) => `${i}: ${v}`).join('\n')}
`;
fs.writeFileSync('./out.log', logText);
