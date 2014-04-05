#! /usr/bin/env node

var
	commit 	= require('./commands/commit'),
	init 		= require('./commands/init'),
	list 		= require('./commands/list'),
	setstate = require('./commands/setstate'),
	compare 	= require('./commands/compare'),
	_ 			= require('underscore'),
	program 	= require('commander')
	;

var intro = [
	"Photon.js",
	"Simulation state version control."
].join('\n')

program
  .version('0.0.1')
  .option('-f, --force', 'force a command')

program
	.command('init')
	.description('initialize a new photon repo.')
	.action(function(){
		init()
	});

program
	.command('commit <commit_message> ')
	.description('commit some state.')
	.action(function(commit_message){
		commit(commit_message, program.force)
	});

program
	.command('list')
	.description('list commits.')
	.action(function(){
		list()
	});

program
	.command('setstate <id>')
	.description('set the state from a commit.')
	.action(function(id){
		setstate(id)
	});

program.parse(process.argv);