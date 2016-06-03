var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

// webhook
router.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === '<validation_token>') {
		res.send(req.query['hub.challenge']);
	} else {
		res.send('Error, wrong validation token');
	}
})

router.post('/webhook/', function(req, res) {
	messaging_events = req.body.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {
		const event = req.body.entry[0].messaging[i];
		const sender = event.sender.id;
		if (event.message && event.message.text) {
			const text = event.message.text;
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
		}
	}
	res.sendStatus(200);
});

var token = "<page_access_token>";

function sendTextMessage(sender, text) {
	messageData = {
		text: text
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: token
		},
		method: 'POST',
		json: {
			recipient: {
				id: sender
			},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending message: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
}

module.exports = router;