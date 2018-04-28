module.exports = function(router) {

	router.get('/', function(req, res) {
		// res.send('ok!');
		res.render('sales/overview')
	});

};