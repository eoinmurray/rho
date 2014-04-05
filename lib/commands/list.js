/*
	Commit.js
*/

var
	FS 		= require('q-io/fs'),
	Q 			= require('q'),
	fs 			= require('fs')
	moment 		= require('moment'),
	_ 				= require('underscore'),
	getlist 		= require('./getlist'),
	path 			= require('path')
	;

var List = function(message){

	return Q.nfcall(getlist)
		.then(function(list_data){
			console.log('\nCommits sorted by date.'.blue)
			_.each(list_data.reverse(), function(item){
				console.log((''+item.id).green,'-', item.files, 'file(s) on', moment().format('MMMM Do YYYY, h:mm a'))
				console.log('\tMessage:'.blue, item.message)

			})
			console.log('\n')
		})

};

module.exports = List;