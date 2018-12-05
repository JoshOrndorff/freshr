#! /usr/bin/env node

const { execSync } = require('child_process');
const { copyFileSync, mkdtempSync, mkdirSync } = require('fs');
const { sep } = require('path');
const { tmpdir } = require('os');

//TODO docopt?
let node8 = false;
if (process.argv.indexOf("node8") >= 0) {
  node8 = true;
}

// Create a temporary data directory
let datadir = mkdtempSync(`${tmpdir()}${sep}freshr-`);

console.log(`The freshr tempdir is ${datadir}.\n`);

// Copy default RNode directory to appropriate place
//TODO Consider generating keys dynamically instead of committing
copyFileSync(`${__dirname}${sep}rnode.toml`, `${datadir}${sep}rnode.toml`);
mkdirSync(`${datadir}${sep}genesis`);
copyFileSync(`${__dirname}${sep}bonds.txt` , `${datadir}${sep}genesis${sep}bonds.txt`);
//TODO relative paths in rnode.toml are relative to the pwd, not the toml file, so
// I'm forced to put the bonds file in the default location. Better solution is to
// generate the toml file on the fly which would lend nicely to generating keys
// on the fly, but would also require generating the bonds file on the fly


// Start node
//TODO move --has-faucet to rnode.toml
// The line `has-faucet = true` doesn't seem to work under [server] or [validators]
execSync(`rnode run --has-faucet --data${node8?'-':'_'}dir ${datadir}`, { stdio: 'inherit' });
