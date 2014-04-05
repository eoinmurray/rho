/*
	Commit.js
*/

var
	FS 		= require('q-io/fs'),
	Q 			= require('q'),
	fs 			= require('fs')
	moment 		= require('moment'),
	_ 				= require('underscore'),
	path 			= require('path')
	getlist 		= require('./getlist')
	;

var Compare = function(callback){

	// Returns True if state is the same, else false.
	// First get the newest commit.
	// Then compare it with the state specified in photon.json

	var data = JSON.parse(fs.readFileSync('photon.json', 'utf-8'))

	return Q.nfcall(getlist)
		.then(function(list){
			var newestCommit = list[0]
			if(_.isUndefined(newestCommit)) return callback(null, false)

			var newestPathState = path.join('./photon', newestCommit.id, 'state')
			var newestPathResults = path.join('./photon', newestCommit.id, 'results')

			return Q.all([
				Q.all(data.results.map(function (value) {
						return Q.all([
							FS.read(value),
							FS.read(path.join(newestPathResults, value))
						])
				})),
				Q.all(data.state.map(function (value) {
						return Q.all([
							FS.read(value),
							FS.read(path.join(newestPathState, value))
						])
				}))
			])
			.then(function(arr){
				return _.map(_.flatten(arr, true), function(item){ return item[0] === item[1] })
			})
			.then(function(booleArr){
				var boole = _.filter(booleArr, function(item){ return item === false }).length >= 1
				callback(null, !boole)
			})
			.fail(function(err){
				callback(err, null)
			})
		})


};

module.exports = Compare;