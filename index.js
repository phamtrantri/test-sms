var express = require('express')
var soap = require('soap');
var bodyParser = require('body-parser')
var cors = require('cors')
const app = express();
app.use(bodyParser.json())
app.use(cors())
const port = 9999;
app.post('/send-sms', (req, res) => {
  const { receiver, message } = req.body;

  var url = 'http://brand.aztech.com.vn/ws/agentSmsApiSoap?wsdl';
  var args = {
      authenticateUser : 'ileantestapi',
      authenticatePass : 'ilean@api@2019',
      brandName : 'AZTECH',
      type : 1,
      receiver,
      message
  };
  soap.createClient(url, function(err, client) {
      if (err) {
        console.log('ERROR: ', err)
      }
      client.sendSms(args, function(err, result) {
          if (err) {
            console.log('ERROR: ', err)
          }
          console.log('RESULT:', result);
          res.send(result)
      });
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
