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

const generateRegistryInfo = (dirPath) => {
	const filePath = `${dirPath.replace(/[\\/]$/, '')}/manifest.json`;
	const key = `HKEY_CURRENT_USER/Software/Google/Chrome/NativeMessagingHosts/${applicationName}`.replace(/[/]/g, '\\');
	const value = filePath.replace(/[/]/g, '\\');
	const regFileContent = `
Windows Registry Editor Version 5.00
[${key}]
@="${value.replace(/[\\]/g, '\\\\')}"
	`.trim();
	return {
		key,
		value,
		regFileContent,
	};
};

export default {
	applicationName,
	generateManifestJson,
	generateRegistryInfo,
};
