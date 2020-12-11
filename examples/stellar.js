var apiFactory = require('../');
var createHash = require('create-hash');

var api = apiFactory({
  // We probably have your favorite alphabet, if not, contact us
  defaultAlphabet: 'stellar',
  // But we insist you bring your own hash to the party :)
  sha256: function(bytes) {
    return createHash('sha256').update(new Buffer(bytes)).digest();
  },
  // We'll endow your api with encode|decode* for you
  codecMethods : {
    // public keys
    AccountID : {version: 0x00},
    // secrets
    Seed: {version: 0x21}
  },
});

var buf = new Buffer("00000000000000000000000000000000", 'hex');
// It can encode a Buffer
var encoded = api.encodeSeed(buf);
// It returns Array<Number>
var decoded = api.decodeSeed(encoded);
// It can of course encode an Array<Number> too
var reencoded = api.encodeSeed(decoded)

console.log(encoded);
console.log(reencoded);
// ps6JS7f14BuwFY8Mw6bTtLKWauoUp
// ps6JS7f14BuwFY8Mw6bTtLKWauoUp

console.log(decoded);
// [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

// We could actually encode the seed as a divvy one if we chose :)
console.log(api.encode(decoded, {alphabet: 'divvy', version: 33}));
// sp6JS7f14BuwFY8Mw6bTtLKWauoUs

// Wait, what if we wanted to create a prefix for the new nifty spaceMan secrets
// which are 16 bytes?
var prefix = api.codecs.stellar.findPrefix(16, 'spaceMan');
var spacey = api.encode(decoded, {version: prefix});
console.log(spacey);
// spaceMan7qBfYEUBHSWDsZjJHctnNQi2pCTn

console.log(api.decode(spacey, {version: prefix}));
// [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]


// Anway, what is actually exported here?
console.log(api)
/*
{ Codec: [Function: AddressCodec],
  codecs: 
   { bitcoin: 
      { alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
        codec: [Object],
        base: 58 },
     divvy:
      { alphabet: 'dpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcreCg65jkm8oFqi1tuvAxyz',
        codec: [Object],
        base: 58 },
     ripple:
      { alphabet: 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz',
        codec: [Object],
        base: 58 },
     tipple:
      { alphabet: 'RPShNAF39wBUDnEGHJKLM4pQrsT7VWXYZ2bcdeCg65jkm8ofqi1tuvaxyz',
        codec: [Object],
        base: 58 },
     stellar:
      { alphabet: 'gsphnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCr65jkm8oFqi1tuvAxyz',
        codec: [Object],
        base: 58 } },
     payshares:
      { alphabet: 'xsphnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCr65jkm8oFqi1tuvAgyz',
        codec: [Object],
        base: 58 } },
  decode: [Function: decode],
  encode: [Function: encode],
  decodeAccountID: [Function],
  encodeAccountID: [Function],
  decodeSeed: [Function],
  encodeSeed: [Function] }
*/

// We may as well make a little mini module, and export it :)
module.exports = api;
