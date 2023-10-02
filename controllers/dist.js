const https = require("https");
const axios = require("axios");
const RADIUS = 50;


function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function toRad(Value) {
  return (Value * Math.PI) / 180;
}

async function processLoc(data) {
  try {
    let urlsnap = "https://router.project-osrm.org/match/v1/driving";

    let reqdata1 = "";
    let reqdata2 = "";

    data.forEach((i) => {
      if (reqdata1) {
        reqdata1 = `${reqdata1};${i[1]},${i[0]}`;
        reqdata2 += `;${RADIUS}`;
      } else {
        reqdata1 = `${i[1]},${i[0]}`;
        reqdata2 = `${RADIUS}`;
      }
    });

    console.log(reqdata1);
    const request = `${urlsnap}/${reqdata1}?radiuses=${reqdata2}`;
    console.log(request);
    
    let out = await axios.get(request);
    
    if (out.status != 200) {
      throw 100;
    }

    return [ out.data.matchings[0].geometry, out.data.matchings[0].distance ];

} catch (e) {
    console.log(e);
    return "", -1;
  }
}

module.exports = { calcCrow, toRad, processLoc };
