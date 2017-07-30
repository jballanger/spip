const chalk = require('chalk');
const read = require('readdir-recursive');
const path = require('path');
const requireStack = require('require-stack');

class ImportManager {
	constructor(base) {
		this.base = base;
		this.imports = {};
	}

	loadFolder(folderName) {
		const folder = path.resolve(this.base, folderName);

		try {
			read.fileSync(folder).forEach(file => {
				const basename = path.basename(file);
				if (!basename.endsWith('.js')) return;

				let imported;
				try {
					imported = requireStack(file);
				} catch (e) {
					return console.error(chalk.red(`Unable to load modules from ${folderName} (${path.relative(folder, file)})\n${e}\n${e.stack}`));
				}

				if (!this.imports[folderName]) {
					this.imports[folderName] = {};
				}

				this.imports[folderName][file] = imported;
			});
		} catch(e) {
			console.error(chalk.red(`Unable to load modules from ${folderName}\n${e}`));
		}
	}

	getImport(folderName) {
		let imported = this.imports[folderName];
		if (!imported) {
			this.loadFolder(folderName);
		}
		return Object.assign({}, this.imports[folderName]);
	}
}

module.exports = ImportManager;