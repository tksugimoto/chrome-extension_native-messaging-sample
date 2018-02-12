#!/usr/bin/env node

const fs = require('fs');
const util = require('util');

const logPath = './out.log';

const logText = `${new Date().toLocaleString()}
${process.argv.map((v, i) => `${i}: ${v}`).join('\n')}
=========================
`;

fs.writeFileSync(logPath, logText);

const lengthBytes = 4;

process.stdin.once('data', _data => {
    const data = new Buffer(_data);
    const lengthBuffer = data.slice(0, lengthBytes);
    const bodyBuffer = data.slice(lengthBytes);
    const bodyLength = lengthBuffer.reduceRight((acc, cur) => acc * 256 + cur);
    log(`data.length: ${data.length}`);
    log(`bodyLength: ${bodyLength}`);
    if (bodyBuffer.length !== bodyLength) {
        // TODO エラー処理
        return process.exit(1);
    }
    const input = JSON.parse(bodyBuffer.toString());
    log(`[input]\n${JSON.stringify(input, null, '\t')}`);
    send({
        res: 'hi!',
        time: new Date(),
        inputValue: input.value,
        nodejs: process.argv[0],
    });
    log(`[raw data.toJSON()]\n${util.inspect(data.toJSON(), {
        maxArrayLength: 30,
        showHidden: true,
    })}`);
});

const send = (messageObject) => {
    const message = JSON.stringify(messageObject);
    const messageBuffer = Buffer.from(message);
    const length = messageBuffer.length;
    const lengthBuffer = Buffer.alloc(lengthBytes);
    lengthBuffer.writeUIntLE(length, 0, lengthBytes);

    process.stdout.write(lengthBuffer);
    process.stdout.write(messageBuffer);
};

const log = str => {
    fs.writeFileSync(logPath, `${str}\n`, {
        flag: 'a',
    });
};
