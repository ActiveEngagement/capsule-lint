#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { version } = require('../package.json');
const { Command } = require('commander');
const { verify } = require('..');

const program = new Command();

program
    .version(version)
    .description('Lint the HTML file(s).')
    .arguments('<file...>')
    .option('-c, --config <path>', 'The JSON config file that defines the rules.', path.resolve('./capsule.config.json'))
    .option('-r, --rules [value...]', 'Select which rule(s) you want to use from the config file.')
    .option('-o, --output <path>', 'Define a file path to output the errors.')
    .action((file, command) => {
        for(let path of file) {
            let rules = JSON.parse(fs.readFileSync(command.config));

            if(command.rules) {
                rules = command.rules.reduce((carry, rule) => Object.assign(carry, {
                    [rule]: rules[rule]
                }), {});
            }

            const errors = verify(fs.readFileSync(path).toString(), rules);

            if(!errors.length) {
                return;
            }
            
            if(command.output) {
                fs.writeFileSync(command.output, JSON.stringify(errors));

                return;
            }
            
            console.log(chalk.yellow(path) + '\n');
            console.warn(errors);
        }
    })
    .parse();