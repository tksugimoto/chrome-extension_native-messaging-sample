import common from './common.js';

chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === 'install') {
		chrome.runtime.openOptionsPage();
	}
});

const CONTEXT_MENU_ID = {
	OPEN_LOCAL_FOLDER: 'open-local-folder',
	OPEN_LOCAL_FILE: 'open-local-file',
};

const createContextMenu = () => {
	chrome.contextMenus.create({
		title: 'フォルダをExplorerで開く',
		contexts: ['page'],
		documentUrlPatterns: [
			'file:///*',
		],
		id: CONTEXT_MENU_ID.OPEN_LOCAL_FOLDER,
	});
	chrome.contextMenus.create({
		title: 'ローカルファイルをExplorerで開く',
		contexts: ['link'],
		targetUrlPatterns: [
			'file:///*',
		],
		id: CONTEXT_MENU_ID.OPEN_LOCAL_FILE,
	});
};

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener((info) => {
	const localFileUrl = info.menuItemId === CONTEXT_MENU_ID.OPEN_LOCAL_FILE ? info.linkUrl : info.pageUrl;
	const filePath = convertUrl2FilePath(localFileUrl);
	const messageToNative = {
		filePath,
	};
	chrome.runtime.sendNativeMessage(common.applicationName, messageToNative, response => {
		console.info({response});
	});
});

const convertUrl2FilePath = encodedUrl => {
	return decodeURI(encodedUrl).replace(/^file:\/\/\//, '').replace(/\//g, '\\');
};
