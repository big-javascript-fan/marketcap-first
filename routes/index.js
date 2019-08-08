var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const API_KEY = '0h752gj6fmsqj7fi3bd';
const INDEX_DIVISOR = 129550;

/* GET home page. */
router.get('/', async function(req, res, next) {
  var value = await fetch('https://marketcap.one/api/1.0/tokens', {
    method: 'GET',
    headers: {
      'MCO-AUTH': API_KEY
    }
  }).then(response => response.json())
  .then(json => {
    var tokens = json.data;
    var total = 0;
    var volume_change = 0;
    for(var i=0; i<tokens.length; i++) {
      if(tokens[i].symbol == 'PEOS' || tokens[i].symbol == 'IQ' || tokens[i].symbol == 'MEETONE' || tokens[i].symbol == 'PTI' || tokens[i].symbol == 'DAPP' || tokens[i].symbol == 'TPT' || tokens[i].symbol == 'EDNA' || tokens[i].symbol == 'DICE') {
        total += 1*tokens[i].current_marketcap;
        console.log(tokens[i].price_change_24hr);
        volume_change += 1 * tokens[i].current_marketcap * 100 / (100 - 1*tokens[i].price_change_24hr);
      }
    }
    var divisor = parseFloat(total/INDEX_DIVISOR).toFixed(2);
    var divisor_change = parseFloat((divisor-1000.0)/10.0).toFixed(2);
    console.log(total);
    console.log(volume_change);
    var change = parseFloat((total - volume_change)/volume_change).toFixed(2);
    total = formatNumber(parseInt(total));
    
    return {
      total, divisor, change, divisor_change
    }
  });
  res.render('index', { value: value });
});

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

module.exports = router;
