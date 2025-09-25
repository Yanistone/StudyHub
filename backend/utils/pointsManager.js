const { User } = require("../models");

// Points constants
const POINTS = {
  CREATE_PROPOSAL: 5,
  PROPOSAL_APPROVED: 5,
  EDIT_APPROVED: 5,
};

/**
 * Add points to a user
 * @param {number} userId - The user ID
 * @param {number} points - The number of points to add
 * @returns {Promise<User>} - The updated user
 */
async function addPoints(userId, points) {
  const user = await User.findByPk(userId);
  if (!user) return null;

  user.points = (user.points || 0) + points;
  await user.save();
  return user;
}

module.exports = {
  POINTS,
  addPoints,
};
