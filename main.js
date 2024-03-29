const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const firebase = require("firebase-admin");
const serviceAccount = {
  "type": "service_account",
  "project_id": "not-gamp-machine",
  "private_key_id": "77378de27950faa4775dfbbb313f380510d6eaf5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDSeIO8f1f9/VIp\nSp9xdXyuwejXtbM8FwK6WZkLPhSaEqwxHRlscH/wG6WoN4vAkKqytGnfaOE6csWz\n25Xygv5beGtebYGfpoQU8sHsWId6oy6CB59Cz73vVjo6oMxOsphodlRKp31S2Z57\n4a3HMjVFyu51U+UQQqR/IBeNxrzLeU3V2Ui582hqv49QSbw0mXzr+JFm1I/0BPtd\nKWPcNdFFO5goi+anmHT6ZlEG8nQWUiFl1ZE/GGnnkLYpM9P/Np7cG8EzTKL3K634\n+dmmreRTudrzSScj86qfdg21Z/N4Fy4tnkUPjx1Re2wnuBQZJvQFsV0NKHedaaMI\nBiCvc3HnAgMBAAECggEAN7GIOpL/98fWu/JxKpbKPXw2Xw5HtXjpUeJvqxfsX7Dd\nO8nVdmp2kFTgixjXtEcTxGIVOfcI0myYgDV1Ak1DfXTqBHy5tkNb5CcwxZfPkdYo\ncmQN8qICQpjwo571MUX1Kn9VYsPbV9caJvHbCEDy89r1KrrefGUGHlWhpfSW9MhT\nbBkqjBzFiq6FvD9GDiy1e+GeB9kdLD0z6sbUQ24eR+gP0cjkQkJaZmVxy6cOoFEP\nXwZg7C8NK4MZ2XOrYwYg3mz9MSqF3nKS4I6YGiHNsgjUNgbUp9I50aNwtgrcXtVK\nVmt4Bb5fS2h+Cj7agWDhJCwN/u32oL/OI+RVFwrfAQKBgQD6TPeIjmhEdWxpR6IM\nl97A0CktOu2jD3XT14FzY4NUnEGh72z7BBznqBQPLrklkBFEtIRLmXuNVq7DIZzN\ngqGSeRDeFyn+se73Y7O212E2jvM0bgiUZNCIcvKkNaEy3heo7NEPUqWteW3Kaehl\ny2LKeJC3AtgGDf3gebmU9Zg6pwKBgQDXQ1/WPCVZDMuR0D/2+qmduFQaBA7EbOTj\njxAkhJbyE1DTF5nTtRln0L58/nHIDZ/JDuG7d7u5MDBBb7olatDsjVoiaAuCZHd5\nsEQ1C3DRfqZCZJz46yThdb432Q/3DDr2xqo3wdYkgLId0ZQ1hNZIPYsjWpb7dHWb\nlst7tDA2wQKBgGknnrLLCTkBj/sm8giSYS3mBfaPlDh2DU1jc2oTu5/3SYeLu+A1\nGSOltE+wlG4YeXjA0fek0ohNi3xFCcg5AkI0BIcZejYbcMaUJ3NARwIRylETjR0y\nwX0htZiRQ1jIf24jl6z1Ts9zfVGVbuIdMTLYtgt88V6R0D/XQ8U17K9vAoGBAK9P\nKnSyBQSR3BQDUqSUnaBaJvwNA+3KdVox/8aNyNSbEH7pwJhe67LVmNz457cyCUhX\n+1SOfW6jJRmVoTap2D5eG+Lbc0wdAAQ1nkbI63dhuotln0VFU4LePi0DdPIQntCt\nGKFSFlEiEm0gaqBvb4fjvzXqp/1fagxtcYhsRbvBAoGBAMmA9HbkOoo+nQzWuPP2\nL8Ad3rY7F31CNSsfkNv1Z25Lhm+S46P/2NNQ110UIULNp3ynpDLLFhOG7yIES2Zl\nlbYZmeN4tkhlMWBnR2JvbXMAKv+gLHBucfI2zf1nhB+rFDc4a7kzVLqqShG65tsY\n1UfYRIx5TY8zZOmBvJw4OqVG\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-m2khz@not-gamp-machine.iam.gserviceaccount.com",
  "client_id": "112921523132428735767",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-m2khz%40not-gamp-machine.iam.gserviceaccount.com"
};
let humedity = 0, temperature = 0;

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://not-gamp-machine.firebaseio.com"
});

setInterval(() => writeSensorData(temperature,humedity), 60*1000);

function writeSensorData(temperature, humedity) {
  const timestamp = Date.now();
  firebase.database().ref('sensordata/'+timestamp).set({
    temperature,
    humedity
  });
  console.log(`Data sent to FireBase correctly at ${timestamp}`);
}
async function readSensorRange(from, to){
  let chartData = [];
  return firebase.database().ref('sensordata/').once('value').then(function(snapshot) {
    let filteredList = Object.keys(snapshot.val()).filter(timestamp => from <= timestamp && timestamp <= to);
    for(let date of filteredList) {
     chartData.push(snapshot.val()[String(date)]);
    }
    return chartData;
  });
}
app.listen(port, '0.0.0.0',() => console.log(`This is real weed API is now working at ${port}!`));

app.get('/set', (req, res) => {
    humedity = req.query.h;
    temperature = req.query.t;
    res.end();
});

app.get('/getRange', (req,res) => {
    const { from, to } = req.query;
    readSensorRange(from, to).then( data => {
      if(data.length === 0) {
        console.log('wrong entry criteria');
      } else {
        console.log('Data filtered correctly');
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ data });
    });
  });

app.get('/data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ humedity, temperature });
  });

app.get('/', (req, res) => {
   res.status(200).send('Welcome to a real triangulation system working with js and arduino');
});

//SONIDOS DE SKATEE PARA AUDIO JORUNEry