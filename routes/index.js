
/*
 * GET home page.
 */


exports.index = function(req, res){
  res.render('index', { title: "Touch Experiment", host: req.protocol + '://' + req.host });
};

exports.view = function(req, res){
  res.render('view', { title: "Touch Experiment", host: req.protocol + '://' + req.host });
};