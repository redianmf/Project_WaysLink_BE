const express = require("express");

const router = express.Router();

// Controller
const {
  getUsers,
  deleteUser,
  getUser,
  editUser,
} = require("../controllers/users");
const { register, login, checkAuth } = require("../controllers/auth");
const {
  publish,
  getBrands,
  deleteBrand,
  getBrand,
  addLinkCount,
  editBrand,
  deleteImage,
  getHost,
  getLinks,
} = require("../controllers/brands");

//Import middlewares
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Route
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", auth, editUser);
router.delete("/user/:id", auth, deleteUser);

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.post("/publish/:id", auth, uploadFile("brandImage"), publish);
router.patch("/edit-brand/:id", auth, uploadFile("brandImage"), editBrand);
router.get("/brands/:id", auth, getBrands);
router.get("/brand/:id", auth, getBrand);
router.delete("/brand/:id", auth, deleteBrand);

router.get("/links/:id", auth, getLinks);
router.patch("/add-click/:id", addLinkCount);
router.get("/host", auth, getHost);
router.get("/delete-image", deleteImage);

module.exports = router;
