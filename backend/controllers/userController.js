const User = require("../models/userModel");
// register user
exports.userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: true,
        message: "User already exists..",
      });
    }
    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "profile pic public_id",
        url: "profile pic url",
      },
    });

    const token = user.getJwtToken();

    res
      .status(201)
      .json({ success: true, message: "register successful...", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email & password invalid..." });
    }

    const isMatchPassword = await user.comparePassword(password);
    console.log(isMatchPassword);
    if (!isMatchPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Email & password invalid..." });
    }

    const token = user.getJwtToken();
    const options = {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.EXPIRE_COPKIE * 24 * 60 * 60 * 1000
      ),
    };

    res
      .status(201)
      .cookie("Token", token, options)
      .json({ success: true, message: "Lofin successful...", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// logout user
exports.logoutUser = async (req, res) => {
  try {
    res.cookie("Token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(200).json({ success: true, message: "Logout successful..." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// update profile
exports.updateProfile = async (req, res) => {
  try {
    const userNewData = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, userNewData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res
      .status(200)
      .json({ success: true, user, message: "Update Successful..." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// get all user ---Admin
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get at a time user deatails ---Admin
exports.getAlluserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `usere not exists with id:${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// user update role ---Admin
exports.updateRole = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `usere not exists with id:${req.params.id}`,
      });
    }

    const userNewData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    user = await User.findByIdAndUpdate(user._id, userNewData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res
      .status(200)
      .json({ success: true, user, message: "Update Successful..." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// delete user ---Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `usere not exists with id:${req.params.id}`,
      });
    }

    await user.remove();

    res.status(200).json({ success: true, message: "Delete Successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.f = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
