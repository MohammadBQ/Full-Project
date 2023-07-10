require("dotenv").config();

const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TOKEN_EXP: process.env.JWT_TOKEN_EXP,
  MONGODB_URL: process.env.MONGODB_URL,
};

if (!config.JWT_TOKEN_EXP) {
  console.log("missing env values!");
  process.exit(1);
}

module.exports = config;
