/*
	SetState.js
*/

var
	FS 			= require('q-io/fs'),
	Q 				= require('q'),
	fs 			= require('fs')
	moment 		= require('moment'),
	_ 				= require('underscore'),
	getlist 		= require('./getlist'),
	path 			= require('path'),
	readline = require('readline')
	;


var prompt = function(callback){
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

	rl.question("There are uncommitted changes. Continue(y/n)? ", function(answer) {
		rl.close();
		if(answer === 'y') callback(null, true)
		else callback(null, false)
	});
}

var SetState = function(id){

	var data = JSON.parse(fs.readFileSync('photon.json', 'utf-8'))

	return Q.nfcall(compare)
	.then(function(same){
		if(!same){
			return Q.nfcall(prompt)
		}
		return true
	})
	.then(function(boole){
		if(boole === true) return Q.nfcall(getlist)
		else throw new Error('No changes')
	})
	.then(function(list_data){
		var uid = _.filter(_.pluck(list_data, 'id'), function(commit_id){
			return (commit_id.indexOf(id) != -1)
		})[0]

		if(_.isUndefined(uid)) throw new Error('Cannot set state. No matching commit id.')
		else return uid
	})
	.then(function(id){
		return Q.all(data.state.map(function (value) {
			console.log('Overwriting current state with state from', (''+id).blue)
			return FS.copy(path.join('./photon/', id, 'state', value), value);
		}))
	})
	.fail(function(err){
		console.log((''+err.message).red)
	})

};

module.exports = SetState;