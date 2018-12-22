"use strict";

const request = require('supertest');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = require('../app');
const database = require('../config/database');
const Meme = require('../models/memeModel');

describe('Test Mongoose database connection', () => {
  test('Test connection', (done) => {
    mongoose.connect(database.URL).then(() => {
      expect(mongoose.connection.readyState).toBe(1);
    });
    // mongoose.disconnect();
    done();
  });
});

describe('Test routers', () => {
  test('GET request for list of all items', (done) => {
    request(app).get('/meme/list').set('Accept', 'application/json')
    .then((response) => {
      expect(response.statusCode).toBe(200);
      done();
      });
  });
  
  let new_id = '';
  
  test('Insert test meme', (done) => {
    mongoose.connect(database.URL);
    const meme = new Meme({
		name: 'Meme',
		width: 640,
		height: 480,
		background_color: 'black',
		image_url: 'http://www.test.com/test.png',
		image_width: 100,
		image_height: 200,
		image_x: 10,
		image_y: 20,
		font_size: 30,
		font_color: 'white',
		text_x: 100,
		text_y: 200,
		caption: 'Test'
	});
    
    meme.save()
      .then((insert) => {
        new_id = insert._id;
        done();
      }, (err) => {
        throw new Error('Insert error: ' + err);
      });
    // mongoose.disconnect();
  });
  
  test('GET request for test meme', (done) => {
    request(app).get('/meme/' + new_id + '/json').set('Accept', 'application/json')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Meme');
        done();
	  });
  });
  
  test('Delete test meme', (done) => {
    Meme.deleteOne({_id: new_id})
      .then(() => {
        done();
      }, (err) => {
        throw new Error('Delete error: ' + err);
      });
  });
});
