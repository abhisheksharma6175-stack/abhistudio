const User = require("../models/User");

// View current user profile.
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// Update user profile.
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
