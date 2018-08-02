#!/usr/bin/env node

'use strict';

const dns = require('dns');
const log = require('log-update');
const ora = require('ora');
const dgc = require('dep-graph-count');
const upn = require('update-notifier');
const pkg = require('./package.json');

upn({pkg}).notify();

const spinner = ora();

const arg = process.argv[2];
const rep = process.argv[3];
const end = process.exit;

if (!arg || arg === '-h' || arg === '--help') {
	log(`
 Usage: depg <username/org> <repository>

 Example:
  $ depg facebook react
	`);
	end(1);
}

if (!arg || !rep) {
	console.log(`\n › Both fields must not be empty! \n`);
	end(1);
}

dns.lookup('github.com', err => {
	if (err) {
		log(`\n › Please check your internet connection! \n`);
		end(1);
	} else {
		log();
		spinner.text = 'Crunching latest data. Hang on...';
		spinner.start();
	}
});

dgc(arg, rep).then(res => {
	const pass = `
 Repositories that depend on ${rep}

 › ${res.repositories} repositories
 › ${res.packages} packages
	`;

	const fail = `\n › ${arg} hasn't build ${rep} yet! \n`;

	res.repositories === undefined ? log(fail) : log(pass); // eslint-disable-line no-unused-expressions

	spinner.stop();
});
