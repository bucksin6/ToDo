var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ToDo = require('../models/todos');
var logger = require('../../config/logger');
var multer = require('multer');
var mkdirp = require('mkdirp');

module.exports = function (app, config) {
  app.use('/api', router);

  router.route('/todos/user/:userId').get(function(req,res,next){
    logger.log('Get todo', 'verbose');
    var query = ToDo
    .find()
    .sort(req.query.order)
    .exec()
    .then(result => {
      if(result && result.length) {
        res.status(200).json(result);
      } else {
        res.status(404).json({message: 'No todos'});
      }
    })
    .catch(err => {
      return next(err);
    });
  });

  router.post('/todos/', function(req,res,next){
    logger.log('Created a todo ' + req.body.todo, 'verbose');
    var todo = new ToDo(req.body);
    todo.save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err=> {
      return next(err);
    });
  });

  router.route('/todos/:todoId').put(function(req, res, next){
    logger.log('Update todos', 'verbose');

    ToDo.findOneAndUpdate({_id: req.params.todoId},
    req.body, {new:true, multi:false})
    .then(ToDo => {
      res.status(200).json(ToDo);
    })
    .catch(error => {
      return next(error);
    });
  });

  router.route('/todos/:todoId').delete(function(req,res,next){
    logger.log('Delete todo ' + req.params.userId, 'verbose');

    ToDo.remove({_id: req.params.todoId })
    .then(ToDo => {
      res.status(200).json({message: "Todo Deleted"});
    })
    .catch(error => {
      return next(error);
    });
  });

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var path = config.uploads + req.params.userId + "/";
      mkdirp(path, function(err) {
        if(err){
          res.status(500).json(err);
        } else {
          cb(null, path);
        }
      });
    },
    fileName: function (req, file, cb) {
      var fileName = file.originalname.split('.');
      console.log(fileName);
      cb(null, fileName[0] + new Date().getTime() + "." + fileName[fileName.length - 1]);
    }
  });

  var upload = multer({ storage: storage });

  router.post('/todos/upload/:userId/:todoId', upload.any(), function(req, res, next){
      logger.log('Upload file for todo ' + req.params.todoId + ' and ' + req.params.userId, 'verbose');

      ToDo.findById(req.params.todoId, function(err, todo){
          if(err){
              return next(err);
          } else {
              if(req.files){
                  todo.file = {
                      fileName : req.files[0].filename,
                      originalName : req.files[0].originalname,
                      dateUploaded : new Date()
                  };
              }
              todo.save()
                  .then(todo => {
                      res.status(200).json(todo);
                  })
                  .catch(error => {
                      return next(error);
                  });
          }
      });

  });
};
