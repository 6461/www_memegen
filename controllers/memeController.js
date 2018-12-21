"use strict";

const Meme = require('../models/memeModel');
const PDFDocument = require('pdfkit');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// API functions (api_*) return JSON objects
// FILE functions (file_*) return files (SVG/PDF)
// NAVI functions (navi_*) render pages with Express

function generate_svg(m) {
	// Render SVG content (svg) from Meme (m)
	let svg = '<svg viewBox="0 0 ' + m.width + ' ' + m.height + '" ';
	svg += 'xmlns="http://www.w3.org/2000/svg" version="1.1">\n';
	svg += '<style>\n';
	svg += '.txt {font: normal normal bold ' + m.font_size;
	svg += 'px sans-serif; fill: ' + m.font_color + ';}\n';
	svg += '</style>\n';
	svg += '<rect width="100%" height="100%" fill="';
	svg += m.background_color + '" />\n';
	svg += '<image href="' + m.image_url + '" width="';
	svg += m.image_width + '" height="' + m.image_height;
	svg += '" x="' + m.image_x + '" y="' + m.image_y + '" />\n';
	svg += '<text x="' + m.text_x + '" y="' + m.text_y;
	svg += '" class="txt">' + m.caption + '</text>\n';
	svg += '</svg>';
	return svg;
}

exports.api_get_list = function(req, res, next) {
	Meme.find()
	.exec(function (err, list) {
		if (err) {
			res.status(500).send({error: 'Error getting list'});
			return next(err);
		} else {
			// Successful
			res.status(200).json(list);
		}
	});
};

exports.api_get_delete = function(req, res, next) {
	Meme.findByIdAndRemove(req.params.id, function deleteMeme(err) {
		if (err) {
			res.status(500).send({error: 'Error deleting meme'});
			return next(err);
		} else {
			// Successful
			res.json({success: true});
		}
	});
};

exports.api_get_json = function(req, res, next) {
	Meme.findById(req.params.id)
	.exec(function (err, meme) {
		if (err) {
			return next(err);
		}
		if (meme == null) {
			var err = new Error('Meme not found');
			err.status = 404;
			return next(err);
		}
		// Successful
		res.status(200).json(meme);;
	});
};

exports.file_get_svg = function(req, res, next) {
	Meme.findById(req.params.id)
	.exec(function (err, meme) {
		if (err) {
			return next(err);
		}
		if (meme == null) {
			var err = new Error('Meme not found');
			err.status = 404;
			return next(err);
		}
		// Successful
		let svg = generate_svg(meme);
		// send plaintext SVG
		res.type('image/svg+xml');
		res.send(svg);
	});
};

exports.file_get_svg_download = function(req, res, next) {
	Meme.findById(req.params.id)
	.exec(function (err, meme) {
		if (err) {
			return next(err);
		}
		if (meme == null) {
			var err = new Error('Meme not found');
			err.status = 404;
			return next(err);
		}
		// Successful
		let svg = generate_svg(meme);
		let filename = meme._id + '.svg';
		// Set headers
		res.type('image/svg+xml');
		res.setHeader('Content-Disposition',
			'attachment; filename="' + filename + '"');
		// Send SVG file
		res.send(svg);
	});
};

exports.file_get_pdf = function(req, res, next) {
	Meme.findById(req.params.id)
	.exec(function (err, meme) {
		if (err) {
			return next(err);
		}
		if (meme == null) {
			var err = new Error('Meme not found');
			err.status = 404;
			return next(err);
		}
		// Successful
		let svg = generate_svg(meme);
		// Set up new PDF document
		const doc = new PDFDocument();
		let filename = meme._id + '.pdf';
		// Set headers
		res.type('application/pdf');
		res.setHeader('Content-Disposition',
			'attachment; filename="' + filename + '"');
		// Write document contents
		doc.font('Times-Roman');
		doc.fontSize(24).text('MemeGen').moveDown(1);
		doc.fontSize(12).text(meme.name, {underline: true}).moveDown(1);
		doc.fontSize(10).text('SVG data').moveDown(1);
		doc.fontSize(10).text(svg).moveDown(1);
		doc.fontSize(10).text('JSON data').moveDown(1);
		doc.fontSize(10).text(JSON.stringify(meme));
		// Send PDF file
		doc.pipe(res);
		doc.end();
	});
};

exports.navi_get_meme = function(req, res, next) {
	Meme.findById(req.params.id)
	.exec(function (err, meme) {
		if (err) {
			return next(err);
		}
		if (meme == null) {
			var err = new Error('Meme not found');
			err.status = 404;
			return next(err);
		}
		// Successful
		res.render('meme', {meme: meme});
	});
};

exports.navi_get_create = function(req, res, next) {
	res.render('form', {title: 'Create meme'});
};

exports.navi_post_create =  [
	// Validate fields.
	body('name', 'Meme name required').isLength({ min: 1 }).trim(),
	body('width').isNumeric(),
	body('height').isNumeric(),
	body('background_color', 'Background color required').isLength({ min: 1 }).trim(),
	body('image_url', 'Image URL required').isLength({ min: 1 }).trim(),
	body('image_width').isNumeric(),
	body('image_height').isNumeric(),
	body('font_size').isNumeric(),
	body('font_color', 'Font color required').isLength({ min: 1 }).trim(),
	body('caption', 'Caption required').isLength({ min: 1 }).trim(),
	
	// Sanitize fields.
	sanitizeBody('name').trim(),
	sanitizeBody('background_color').trim(),
	sanitizeBody('image_url').trim(),
	sanitizeBody('font_color').trim(),
	sanitizeBody('caption').trim(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create an item object with escaped and trimmed data.
		var meme = new Meme({
			name: req.body.name,
			width: req.body.width,
			height: req.body.height,
			background_color: req.body.background_color,
			image_url: req.body.image_url,
			image_width: req.body.image_width,
			image_height: req.body.image_height,
			image_x: req.body.image_x,
			image_y: req.body.image_y,
			font_size: req.body.font_size,
			font_color: req.body.font_color,
			text_x: req.body.text_x,
			text_y: req.body.text_y,
			caption: req.body.caption
		});
		
		if (!errors.isEmpty()) {
			// There are errors.
			// res.status(500).send({error: 'Error creating meme'});
			var err = new Error('Error creating meme');
			err.status = 500;
			return next(err);
		} else {
			// Data from form is valid.
			meme.save(function (err) {
				if (err) {
					// res.status(500).send({error: 'Error creating meme'});
					return next(err);
				} else {
					// Successful
					// res.status(200).json(meme);
					res.redirect(meme.url);
				}
			});
		}
	}
];

exports.navi_get_update = function(req, res, next) {
	Meme.findById(req.params.id)
	.exec(function (err, meme) {
		if (err) {
			return next(err);
		}
		if (meme == null) {
			var err = new Error('Meme not found');
			err.status = 404;
			return next(err);
		}
		// Successful
		res.render('form', {title: 'Update meme', meme: meme});
	});
};

exports.navi_post_update =  [
	// Validate fields.
	body('name', 'Meme name required').isLength({ min: 1 }).trim(),
	body('width').isNumeric(),
	body('height').isNumeric(),
	body('background_color', 'Background color required').isLength({ min: 1 }).trim(),
	body('image_url', 'Image URL required').isLength({ min: 1 }).trim(),
	body('image_width').isNumeric(),
	body('image_height').isNumeric(),
	body('font_size').isNumeric(),
	body('font_color', 'Font color required').isLength({ min: 1 }).trim(),
	body('caption', 'Caption required').isLength({ min: 1 }).trim(),
	
	// Sanitize fields.
	sanitizeBody('name').trim(),
	sanitizeBody('background_color').trim(),
	sanitizeBody('image_url').trim(),
	sanitizeBody('font_color').trim(),
	sanitizeBody('caption').trim(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create an item object with escaped and trimmed data.
		var meme = new Meme({
			_id: req.params.id,
			name: req.body.name,
			width: req.body.width,
			height: req.body.height,
			background_color: req.body.background_color,
			image_url: req.body.image_url,
			image_width: req.body.image_width,
			image_height: req.body.image_height,
			image_x: req.body.image_x,
			image_y: req.body.image_y,
			font_size: req.body.font_size,
			font_color: req.body.font_color,
			text_x: req.body.text_x,
			text_y: req.body.text_y,
			caption: req.body.caption
		});

		if (!errors.isEmpty()) {
			// There are errors.
			// res.status(500).send({error: 'Error updating meme'});
			var err = new Error('Error creating meme');
			err.status = 500;
			return next(err);
		} else {
			// Data from form is valid. Update.
			Meme.findByIdAndUpdate(req.params.id, meme, {}, function (err, thememe) {
				if (err) {
					// res.status(500).send({error: 'Error updating meme'});
					return next(err);
				} else {
					// Successful
					// res.status(200).json(meme);
					res.redirect(meme.url);
				}
			});
		}
	}
];
