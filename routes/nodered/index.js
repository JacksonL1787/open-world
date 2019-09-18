var express = require('express');
var router = express.Router();

router.post('/recieve', function (req, res, next) {
	var io = req.app.get('socket.io');
	console.log(req.body)
	if(req.body[0] == 'doorClosed' || req.body[0] == 'doorOpen') {
	    io.emit('updateDoorStatus', req.body[0]);
	} else {
	    io.emit('updateCurrentTemperature', req.body[0]);
	}
    
	res.sendStatus(200)
})

module.exports = router;
