"use strict";

/* https://mongoosejs.com/docs/schematypes.html */

var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MemeSchema = new Schema({
	name: {
		type:		String,
		required:	true,
		min:		1,
		max:		100},
	date: {
		type:		Date,
		default:	Date.now},
	width: {
		type:		Number,
		required:	true,
		min:		1,
		max:		9999},
	height: {
		type:		Number,
		required:	true,
		min:		1,
		max:		9999},
	background_color: {
		type:		String,
		required:	true,
		min:		1,
		max:		100},
	image_url: {
		type:		String,
		required:	true,
		min:		1,
		max:		200},
	image_width: {
		type:		Number,
		required:	true,
		min:		1,
		max:		9999},
	image_height: {
		type:		Number,
		required:	true,
		min:		1,
		max:		9999},
	image_x: {
		type:		Number,
		required:	true,
		min:		1,
		max:		9999},
	image_y: {
		type:		Number,
		required:	true,
		min:		1,
		max:		9999},
	font_size: {
		type:		Number,
		required:	true,
		min:		1,
		max:		9999},
	font_color: {
		type:		String,
		required:	true,
		min:		1,
		max:		100},
	text_x: {
		type:		Number,
		required:	true,
		min:		1,
		max:		9999},
	text_y: {
		type:		Number,
		required:	true,
		min:		1,
		max:		9999},
	/* Use the name "caption" instead of "text" to be safe */
	/* "text" is not a reserved word but may cause problems */
	caption: {
		type:		String,
		required:	true,
		min:		1,
		max:		200}
});

MemeSchema.virtual('url')
	.get(function() {
		return '/meme/' + this._id;
});

MemeSchema.virtual('svg_url')
	.get(function() {
		return '/meme/' + this._id + '/svg';
});

MemeSchema.virtual('date_formatted')
	.get(function() {
		let df = this.date ? moment(this.date).format('D.M.YYYY HH.mm') : '';
		return df;
});

module.exports = mongoose.model('Meme', MemeSchema);
