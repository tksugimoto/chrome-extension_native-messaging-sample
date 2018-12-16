import common from './common.js';

chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === 'install') {
		chrome.runtime.openOptionsPage();
	}
});

chrome.runtime.onMessage.addListener((message) => {
	if (message.method === 'open-local-file-by-explorer') {
		const localFileUrl = message.localFileUrl;
		const filePath = decodeURI(localFileUrl).replace(/^file:\/\/\//, '').replace(/\//g, '\\');
		const messageToNative = {
			filePath,
		};
		chrome.runtime.sendNativeMessage(common.applicationName, messageToNative, response => {
			console.info({response});
		});
	}
});
