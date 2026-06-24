#!/usr/bin/env node
/* eslint-disable no-console */
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const LINT_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

const getStagedLintFiles = () => {
    const stdout = execSync('git diff --cached --name-only --diff-filter=ACMR', {
        encoding: 'utf8',
    });

    return stdout
        .split('\n')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .filter((entry) => LINT_EXTENSIONS.has(path.extname(entry)))
        .map((entry) => path.join(ROOT_DIR, entry))
        .filter((entry) => fs.existsSync(entry));
};

const run = () => {
    const files = getStagedLintFiles();

    if (files.length === 0) {
        console.log('[lint-staged] No staged JS/TS files. Skip.');
        return;
    }

    console.log(`[lint-staged] Linting ${files.length} staged file(s).`);

    const result = spawnSync('npx', ['eslint', ...files], {
        stdio: 'inherit',
        shell: false,
    });

    if (typeof result.status === 'number') {
        process.exit(result.status);
    }

    process.exit(1);
};

try {
    run();
} catch (error) {
    console.error('[lint-staged] Failed:', error.message);
    process.exit(1);
}
