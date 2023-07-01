const express = require("express");
const { userRegister, loginUser, logoutUser, getUserDetails, updateProfile, getAllUser, getAlluserDetails, updateRole, deleteUser } = require("../controllers/userController");
const { isAuthenticated, authorizeRole } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(userRegister)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/me").get(isAuthenticated, getUserDetails)
router.route("/updateProfile").post(isAuthenticated, updateProfile)
router.route("/admin/getAlluser").get(isAuthenticated, authorizeRole("admin"), getAllUser)
router.route("/admin/user/:id")
    .get(isAuthenticated, authorizeRole("admin"), getAlluserDetails)
    .put(isAuthenticated, authorizeRole("admin"), updateRole)
    .delete(isAuthenticated, authorizeRole("admin"), deleteUser)

module.exports = router 