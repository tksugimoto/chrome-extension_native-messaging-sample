import common from '../common.js';

{
	const downloadLink = document.getElementById('manifest-json-download-link');
	const nativeMessagingHostBinaryPath = 'native-messaging-host-app.bat';
	const manifestJsonContent = common.generateManifestJson(nativeMessagingHostBinaryPath);
	document.getElementById('manifest-json-content').innerText = manifestJsonContent;
	const blob = new Blob([manifestJsonContent], {
		type: 'text/plain',
	});
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = 'manifest.json';
}

{
	const dirPath = document.getElementById('dirPath');
	const downloadLink = document.getElementById('reg-download-link');
	downloadLink.download = 'manifest.reg';
	const update = () => {
		const bom8 = '\uFEFF';
		const content = common.generateRegFile(dirPath.value || dirPath.placeholder);

		const blob = new Blob([bom8 + content], {
			type: 'text/plain',
		});
		downloadLink.href = URL.createObjectURL(blob);

		document.getElementById('reg-content').innerText = content;
	};

	dirPath.addEventListener('change', update);
	dirPath.addEventListener('keyup', update);
	dirPath.addEventListener('paste', () => {
		setTimeout(update, 10);
	});
	update();
}

{
	const testButton = document.getElementById('test');
	testButton.addEventListener('click', () => {
		const message = {
			value: 'test message',
		};
		chrome.runtime.sendNativeMessage(common.applicationName, message, response => {
			const value = {
				response,
			};
			const replacer = null;
			const space = '\t';
			console.log(value);
			document.getElementById('test-output').innerText = JSON.stringify(value, replacer, space);
		});
	});
}

{
	const filePathToOpen = document.getElementById('filePathToOpen');
	const openButton = document.getElementById('open');
	const execOpen = () => {
		let filePath = String(filePathToOpen.value || filePathToOpen.placeholder);
		if (filePath.startsWith('"') && filePath.endsWith('"')) {
			filePath = filePath.slice(1, -1);
		}
		const message = {
			filePath,
		};
		chrome.runtime.sendNativeMessage(common.applicationName, message, response => {
			console.log({response});
		});
	};
	openButton.addEventListener('click', execOpen);
	filePathToOpen.addEventListener('keydown', evt => {
		if (evt.key === 'Enter') {
			execOpen();
		}
	});
}
