var express = require('express');
var request = require('request');
var app = express();

var cors = require('cors');
app.use(cors());


app.get('/', function (req, res) {
  res.send('<div style="background-color:red">hola mundo</div>');
});



app.get('/api/items/:id', function(req, res) {

	// console.log(req.params);

	var id = req.params.id;
	var requestLeft = 2;

	//Creates the object to return
	var result = {
		"author" : {
			"name" : "Emiliano",
			"lastname" : "Tortorelli"
		},
	};

	request('https://api.mercadolibre.com/items/' + id,function (error, response, body){
		body = JSON.parse(body);
		//There could be a race condition here with the other callback, but in that case, there will be two res.send and the user will not be affected
		result.item = {
			"id": body.id,
			"title": body.title,
			"price": {
				"currency":body.currency_id,
				"amount": Math.floor(body.price),
				"decimals":(body.price % 1).toFixed(2)
			},
			"picture": body.pictures ? body.pictures[0].url : '',//body.thumbnail,
			"condition": body.condition === 'used' ? 'Usado' : 'Nuevo',
			"sold_quantity": body.sold_quantity,
			"free_shipping": body.shipping.free_shipping
		};
		requestLeft--;
		if(requestLeft == 0){
			res.send(result)
		}

	})

	request('https://api.mercadolibre.com/items/' + id + '/description',function (error, response, body){

		body = JSON.parse(body);
		if(body.plain_text === '')
			result.description = body.text;
		else
			result.description = body.plain_text;
		// console.log(body);
		
		//There could be a race condition here with the other callback, but in that case, there will be two res.send and the user will not be affected
		requestLeft--;
		if(requestLeft == 0){
			res.send(result)
		}
	})
});

app.get('/api/items', function (req, res) {
	var query = req.query.q ;

	if(query == undefined){
		res.send('Error');
		return;
	}

	request('https://api.mercadolibre.com/sites/MLA/search?q=' + query, function (error, response, body) {
		if (error || response.statusCode != 200) {
			res.send('Ha ocurrido un error al llamar a la api de Mercado Libre');
			return;
		}
		// res.send(body);
		body = JSON.parse(body);

		//Creates the object to return
		var result = {
			"author" : {
				"name" : "Emiliano",
				"lastname" : "Tortorelli"
			},
			items: []
		};

		var category = body.filters.find(function(filter) {
			return filter.id === 'category';
		});
		result.categories = category == undefined ? [] : category.values[0].path_from_root.map(function(a) {return a.name;});

		//The requirement says to show only four items, so I'm only getting the first four
		for(var i = 0; i < 4 && i < body.results.length;i++) {
			result.items.push({
				"id":body.results[i].id,
				"title":body.results[i].title,
				"price": {
					"currency":body.results[i].currency_id,
					"amount": Math.floor(body.results[i].price),
					"decimals":(body.results[i].price % 1).toFixed(2)
				},
				// I'm adding this property because it's required in the mockups
				"place" :body.results[i].address.state_name,
				"picture": body.results[i].thumbnail,
				"condition": body.results[i].condition,
				"free_shipping": body.results[i].shipping.free_shipping
			});
		}

		res.send(result);

	})
})

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});