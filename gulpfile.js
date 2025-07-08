const path = require('path');
const { task } = require('gulp');
const fs = require('fs');

task('build:icons', copyIcons);

// Collect all matching files
function collectFiles(sourceDir, extensions, result = []) {
	// Read directory contents
	const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

	for (const entry of entries) {
		const sourcePath = path.join(sourceDir, entry.name);

		if (entry.isDirectory()) {
			// Process subdirectories recursively
			collectFiles(sourcePath, extensions, result);
		} else if (entry.isFile()) {
			// Check file extension
			const ext = path.extname(entry.name).toLowerCase();
			if (extensions.includes(ext)) {
				result.push(sourcePath);
			}
		}
	}

	return result;
}

function copyIcons(done) {
	const extensions = ['.png', '.svg'];

	// Collect and copy node icons
	const nodeFiles = collectFiles(path.resolve('nodes'), extensions);
	for (const file of nodeFiles) {
		const relativePath = path.relative(path.resolve('nodes'), file);
		const targetPath = path.resolve('dist', 'nodes', relativePath);
		const targetDir = path.dirname(targetPath);

		// Ensure target directory exists
		if (!fs.existsSync(targetDir)) {
			fs.mkdirSync(targetDir, { recursive: true });
		}

		// Copy file directly
		fs.copyFileSync(file, targetPath);
	}

	// Collect and copy credential icons
	if (fs.existsSync(path.resolve('credentials'))) {
		const credFiles = collectFiles(path.resolve('credentials'), extensions);
		for (const file of credFiles) {
			const relativePath = path.relative(path.resolve('credentials'), file);
			const targetPath = path.resolve('dist', 'credentials', relativePath);
			const targetDir = path.dirname(targetPath);

			// Ensure target directory exists
			if (!fs.existsSync(targetDir)) {
				fs.mkdirSync(targetDir, { recursive: true });
			}

			// Copy file directly
			fs.copyFileSync(file, targetPath);
		}
	}

	done();
}
