const applicationName = `com.github.tksugimoto.native_messaging_test_${chrome.runtime.id}`;

const generateManifestJson = (path) => {
	const value = {
		name: applicationName,
		description: 'sample',
		path,
		type: 'stdio',
		allowed_origins: [
			`chrome-extension://${chrome.runtime.id}/`,
		],
	};
	const replacer = null;
	const space = '\t';
	return JSON.stringify(value, replacer, space);
};

const generateRegFile = (dirPath) => {
	const filePath = `${dirPath.replace(/[\\/]$/, '')}/manifest.json`;
	const value = `
Windows Registry Editor Version 5.00
[HKEY_CURRENT_USER/Software/Google/Chrome/NativeMessagingHosts/${applicationName}]
@="${filePath.replace(/[\\/]/g, '//')}"
	`.trim().replace(/[/]/g, '\\');
	return value;
};

export default {
	applicationName,
	generateManifestJson,
	generateRegFile,
};
