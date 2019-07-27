var express = require('express')
var soap = require('soap');
const app = express();
const port = 9999;
app.get('/send-sms', (req, res) => {
  var url = 'http://brand1.aztech.com.vn/ws/agentSmsApiSoap?wsdl';
  var args = {
      authenticateUser : 'ileantestapi',
      authenticatePass : 'ilean@api@2019',
      brandName : 'AZTECH',
      type : 1,
      receiver: '84775417247',
      message: 'Zenbox thong bao, chuc mung khach hang',
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
