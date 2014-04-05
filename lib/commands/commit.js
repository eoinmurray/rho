/*
	Commit.js
*/

var
	FS 		= require('q-io/fs'),
	Q 			= require('q'),
	fs 		= require('fs')
	moment 	= require('moment'),
	_ 			= require('underscore'),
	colors = require('colors'),
	path 		= require('path'),
	compare	= require('./compare')
	;

var Commit = function(message, force){
	if(_.isUndefined(force)) force = false
	else force = true


	var date = new Date();
	var uid = moment(date).format('MMMM_Do_YYYY_h_mm_a');

	var data = JSON.parse(fs.readFileSync('photon.json', 'utf-8'))
	var filesLength = data.state.length + data.results.length

	var commitMeta = {
		'id' : uid,
		'date' : date,
		'message' : message,
		'files' : filesLength,
		'stateLength' : data.state.length,
		'resultsLength' : data.results.length,
	}

	var commitMetaStr = JSON.stringify(commitMeta, null, "\t")

	return Q.nfcall(compare)
	.then(function(same){
		if(same && !force) throw new Error('No changes have been made since the last commit. Add -f to force.')
		else return FS.makeDirectory(path.join('./photon/', uid))
	})
	.then(function(){
		return FS.write(path.join('./photon/', uid, 'commit_data.json'), commitMetaStr)
	})
	.then(function(err){
		return FS.makeDirectory(path.join('./photon/', uid, 'state'))
	})
	.then(function(){
		return Q.all(data.state.map(function (value) {
			return FS.copy(value, path.join('./photon/', uid, 'state', value));
		}))
	})
	.then(function(data){
		return FS.makeDirectory(path.join('./photon/', uid, 'results'))
	})
	.then(function(){
		return Q.all(data.results.map(function (value) {
 			return FS.copy(value, path.join('./photon/', uid, 'results', value));
		}))
	})
	.then(function(){
		return console.log('Committed:'.green, (data.state.length + data.results.length) +' file(s) on ' + moment().format('MMMM Do YYYY, h:mm a'))
	})
	.fail(function(err){
		return console.log('Error:'.red, err.message)
	})



};

module.exports = Commit;