const bcrypt = require("bcrypt");

module.exports = async (password) => {
  const saltRounds = 10;
  console.log(password);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
