
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.view = function(req, res){
  res.render('view', { title: 'Express' });
};