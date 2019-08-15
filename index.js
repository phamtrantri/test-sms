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

  var url = 'http://center.fibosms.com/service.asmx?wsdl';
  var args = {
      clientNo : 'CL1809200001',
      clientPass : '9QWRCd8MtDNYeMvj',
      senderName : 'LONGCODE',
      smsGUID : 0,
      phoneNumber: receiver,
      smsMessage: message,
      serviceType: 0
  };
  soap.createClient(url, function(err, client) {
      if (err) {
        console.log('ERROR: ', err)
      }
      console.log(client)
      client.SendMaskedSMS(args, function(err, result) {
          if (err) {
            console.log('ERROR: ', err)
          }
          const resp = result.SendMaskedSMSResult.match(/[0-9]/g).join('')
          console.log('RES:', resp);
          res.send({Return: resp})
      });
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
