import common from '../common.js';

{
	const downloadLink = document.getElementById('manifest-json-download-link');
	const nativeMessagingHostBinaryPath = 'native-messaging-host-app.bat';
	const blob = new Blob([common.generateManifestJson(nativeMessagingHostBinaryPath)], {
		type: 'text/plain',
	});
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = 'manifest.json';
}

{
	const downloadLink = document.getElementById('reg-download-link');
	const dirPath = String.raw`C:\path\to`;
	const content = common.generateRegFile(dirPath);
	const blob = new Blob([content], {
		type: 'text/plain',
	});
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = 'manifest.reg';

	document.getElementById('reg-content').innerText = content;
}
