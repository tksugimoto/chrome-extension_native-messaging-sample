#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const execFile = require('child_process').execFile;
const pathJoin = require('path').join;

const logPath = pathJoin(__dirname, 'out.log');

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
    if (input.filePath) {
        openByExplorer(input.filePath);
        return;
    }
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

/** Explorerで開く
 * - path が ディレクトリ(末尾が\\) の場合: ディレクトリを開く
 * - path が ファイル の場合: 選択した状態で開く
 * @param {string} path
 */
const openByExplorer = path => {
    path = path.replace(/\\+$/, '');
    fs.stat(path, (err, stats) => {
        log('fs.stat: ' + JSON.stringify({err, stats}, null, '\t'));
        if (err) {
            // file or directory が無い
            send({
                message: `"${path}" にファイル/フォルダが存在しない`,
                err,
            });
            return;
        }
        if (stats.isDirectory()) {
            log(`openByExplorer [dir]: ${path}`);
            execFile('explorer', [path]);
            send({
                message: `フォルダ "${path}" を開きました`,
            });
        } else {
            log(`openByExplorer [file]: ${path}`);
            execFile('explorer', ['/select,', path]);
            send({
                message: `ファイル "${path}" を開きました`,
            });
        }
    });
};
