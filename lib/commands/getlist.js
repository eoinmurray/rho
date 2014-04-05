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
	;

module.exports = function(callback){

	return FS.list('./photon/')
		.then(function(list){
			return Q.all(list.map(function (ppath) {
				return FS.read(path.join('./photon/', ppath, 'commit_data.json'));
			}))
		})
		.then(function(list_data){
			list_data = JSON.parse('['+ list_data.join(',') + ']')
			list_data = list_data.sort(function(a,b){
	  			return new Date(b.date) - new Date(a.date);
			})
			return list_data
		})
		.then(function(list_data){
			callback(null, list_data)
		})
		.fail(function(err){
			callback(err, null)
		})

};
