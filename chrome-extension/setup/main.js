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
	const dirPath = document.getElementById('dirPath');
	const downloadLink = document.getElementById('reg-download-link');
	downloadLink.download = 'manifest.reg';
	const update = () => {
		const bom8 = '\uFEFF';
		const content = common.generateRegFile(dirPath.value || dirPath.placeholder);

		const uint8Array = new TextEncoder('utf-8').encode(bom8 + content);
		const blob = new Blob([uint8Array], {
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
