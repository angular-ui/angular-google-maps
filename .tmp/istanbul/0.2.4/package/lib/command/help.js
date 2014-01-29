/*
 Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var Command = require('./index.js'),
    util = require('util'),
    formatOption = require('../util/help-formatter').formatOption,
    VERSION = require('../../index').VERSION,
    configuration = require('../configuration'),
    yaml = require('js-yaml'),
    formatPara = require('../util/help-formatter').formatPara;

function showConfigHelp(toolName) {

    console.error('\nConfiguring ' + toolName);
    console.error('====================');
    console.error('\n' +
        formatPara(toolName + ' can be configured globally using a .istanbul.yml YAML file ' +
            'at the root of your source tree. Every command also accepts a --config=<config-file> argument to ' +
            'customize its location per command. The alternate config file can be in YAML, JSON or node.js ' +
            '(exporting the config object).'));
    console.error('\n' +
        formatPara('The config file currently has three sections for instrumentation, reporting and hooks. ' +
            'Note that certain commands (like `cover`) use information from multiple sections.'));
    console.error('\n' +
        formatPara('Keys in the config file usually correspond to command line parameters with the same name. ' +
            'The verbose option for every command shows you the exact configuration used'));

    console.error('\nThe default configuration is as follows:\n');
    console.error(yaml.safeDump(configuration.defaultConfig(), { indent: 4, flowLevel: 3 }));
    console.error('\n' +
        formatPara('The `watermarks` section does not have a command line equivalent. It allows you to set up ' +
            'low and high watermark percentages for reporting. These are honored by all reporters that colorize ' +
            'their output based on low/ medium/ high coverage'));
}

function HelpCommand() {
    Command.call(this);
}

HelpCommand.TYPE = 'help';
util.inherits(HelpCommand, Command);

Command.mix(HelpCommand, {
    synopsis: function () {
        return "shows help";
    },

    usage: function () {

        console.error('\nUsage: ' + this.toolName() + ' ' + this.type() + ' config | <command>\n');
        console.error('`config` provides help with istanbul configuration\n');
        console.error('Available commands are:\n');

        var commandObj;
        Command.getCommandList().forEach(function (cmd) {
            commandObj = Command.create(cmd);
            console.error(formatOption(cmd, commandObj.synopsis()));
            console.error("\n");
        });
        console.error("Command names can be abbreviated as long as the abbreviation is unambiguous");
        console.error(this.toolName() + ' version:' + VERSION);
        console.error("\n");
    },
    run: function (args, callback) {
        var command;
        if (args.length === 0) {
            this.usage();
        } else {
            if (args[0] === 'config') {
                showConfigHelp(this.toolName());
            } else {
                try {
                    command = Command.create(args[0]);
                    command.usage('istanbul', Command.resolveCommandName(args[0]));
                } catch (ex) {
                    console.error('Invalid command: ' + args[0]);
                    this.usage();
                }
            }
        }
        return callback();
    }
});


module.exports = HelpCommand;


