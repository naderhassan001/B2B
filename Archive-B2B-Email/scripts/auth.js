const crypto = require('crypto')
const iso8601 = require('iso8601')
const request = require('request')

module.exports.emAuth = () => {
  function getWsseHeader(user, secret) {
    let nonce = crypto.randomBytes(16).toString('hex');
    let timestamp = iso8601.fromDate(new Date());
    let digest = base64Sha1(nonce + timestamp + secret);
    return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
  }

  function base64Sha1(str) {
    let hexDigest = crypto.createHash('sha1').update(str).digest('hex');
    return new Buffer.from(hexDigest).toString('base64');
  }

  let user = ''
  let secret = ''

  //Use b2c production creds if --b2c_prod passed to npm run <script> command or b2b_prod
  if(process.env.npm_config_b2c_prod) {
    user = process.env.prod_user;
    secret = process.env.prod_secret;
  } else if (process.env.npm_config_b2b_prod) {
    user = process.env.prod_b2b_user;
    secret = process.env.prod_b2b_secret;
  } else {
    user = process.env.sand_user;
    secret = process.env.sand_secret;
  }

  return getWsseHeader(user, secret);
}
