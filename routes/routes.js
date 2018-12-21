"use strict";

// Require controller
var memeController = require('../controllers/memeController');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE
    // =====================================
    app.get('/', isLoggedIn, function(req, res) {
		res.render('index');
    });
	
	app.get('/welcome', function(req, res) {
		res.render('welcome', {title: 'Welcome'});
    });
	
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
		res.render('login', {title: 'Login', message: req.flash('loginMessage')});
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
		res.render('signup', {title: 'Signup', message: req.flash('signupMessage')});
    });

	// process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {title: 'Profile page', user: req.user});
    });
	
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { 
      scope : ['email']
    }));
	
    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/welcome'
        }));
		
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/welcome');
    });
	
	// GET request for list of all items
	app.get('/meme/list', isLoggedIn, memeController.api_get_list);
	
	// GET request for creating an item
	app.get('/meme/create', isLoggedIn, memeController.navi_get_create);
	
	// POST request for creating an item
	app.post('/meme/create', isLoggedIn, memeController.navi_post_create);
	
	// GET request to delete item
	app.get('/meme/:id/delete', isLoggedIn, memeController.api_get_delete);

	// GET request for JSON
	app.get('/meme/:id/json', isLoggedIn, memeController.api_get_json);
	
	// GET request for SVG
	app.get('/meme/:id/svg', isLoggedIn, memeController.file_get_svg);
	
	// GET request for SVG (download)
	app.get('/meme/:id/svg_download', isLoggedIn, memeController.file_get_svg_download);
	
	// GET request for PDF
	app.get('/meme/:id/pdf', isLoggedIn, memeController.file_get_pdf);
	
	// GET request to update item
	app.get('/meme/:id/update', isLoggedIn, memeController.navi_get_update);	
	
	// POST request to update item
	app.post('/meme/:id/update', isLoggedIn, memeController.navi_post_update);
	
	// GET request for one item
	app.get('/meme/:id', isLoggedIn, memeController.navi_get_meme);
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/welcome');
}