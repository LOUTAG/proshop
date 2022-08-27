const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports.generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN, { expiresIn: 60 });
};

module.exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN, {
    expiresIn: 60 * 60 * 24 * 20,
  });
};

module.exports.generatePaypalAccessToken = async() => {
  const auth = Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET).toString("base64");
    const config = {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    try{
      const response = await axios.post(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,new URLSearchParams([['grant_type', 'client_credentials']]).toString(),config);
      const {access_token} = response.data;
      console.log(access_token, 'token.js');
      return access_token;
    }catch(error){
      console.log(error);
      throw error;
    }
};
