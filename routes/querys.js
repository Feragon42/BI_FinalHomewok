var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();

router.post('/uploadRegistration', function(req, res){
  var db = req.db;
  var clients = db.get('clients');
  
  clients.insert({
    'name' : req.body['name'],
    'id_document' : req.body['id_document'],
    'email' : req.body['email'],
    'origin' : req.body['origin'],
    'profession' : req.body['profession'],
    'enterprise' : req.body['enterprise'],
    'charge' : req.body['charge'],
    'hotel_hq' : req.body['hotel_hq'],
    'room_type' : req.body['room_type'],
    'lodging_days' : Number(req.body['lodging_days']),
    'room_cost' : Number(req.body['room_cost']),
    'gym_cost' : Number(req.body['gym_cost']),
    'restaurant_cost' : Number(req.body['restaurant_cost'])
  }, {}, function(e, doc){
    if(e){
            res.json(e)
    }
    else{
      res.json('El cliente ha sido registrado con exito')
    }
  })
})

router.get('/mayorEstadiaEmpresa', function(req, res){
  var db = req.db;
  var clients=db.get('clients');
  
  clients.aggregate([
    {
      $group: {
        _id: '$enterprise',
        lodging_days: { $sum: '$lodging_days' }
      }
    },
    {
      $sort: {
        'lodging_days': -1
      }
    }],
    function(e, data){
      res.json(data);
    }
  );
});

router.get('/mayorEstadiaEstado', function(req, res){
  var db = req.db;
  var clients=db.get('clients');
  
  clients.aggregate([
    {
      $group: {
        _id: {
          enterprise:'$enterprise',
          hotel_hq: '$hotel_hq',
        },
        lodging_days: { $sum: '$lodging_days' }
      }
    },
    {
      $sort: {
        '_id.enterprise': 1,
        'lodging_days': -1
      }
    }],
    function(e, data){
      res.json(data);
    }
  );

});

router.get('/porcentajeDeConsumo', function(req, res){
  var db = req.db;
  var clients=db.get('clients');
  
  clients.aggregate([
    {
      $group: {
          _id: '$enterprise',
          room_cost: { $sum: '$room_cost' },
          gym_cost: {$sum: '$gym_cost'},
          restaurant_cost: {$sum: '$restaurant_cost' }
      }
    },
    {
      $project: {
        _id : 1,
        total_pay: {$add:['$room_cost', '$gym_cost', '$restaurant_cost']}
      }
    },
    {
      $sort : {
        total_pay: -1
      }
    }],
    function(e, data){
      res.json(data);
    }
  );
});

router.get('/porcentajeDeProcedencia', function(req, res){
  var db = req.db;
  var clients=db.get('clients');
  
  clients.aggregate([
    {
      $group: {
        _id: '$origin',
        count : {$sum:1}
      }
    },
    {
      $sort:{
        count:-1
      }
    }],
    function(e, data){
      res.json(data);
    }
  );
});





    
module.exports = router;