const { avatarUser } = require("../services/authService");

const fileController = async (req, res) => {
  const newAvatarUrl = await avatarUser(req);
  res.json({
    status: "success",
    avatar: newAvatarUrl,
  });
};

module.exports = {
  fileController,
};
