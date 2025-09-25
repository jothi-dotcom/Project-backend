const express = require("express");
const { RegisterAPI, loginAPI } = require("../controllers/userController");

const router = express.Router();

router.post("/register" ,RegisterAPI);
router.post("/" ,loginAPI);

module.exports=router;