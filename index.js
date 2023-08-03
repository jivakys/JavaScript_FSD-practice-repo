const express = require("express");
const { userPresent } = require("../middleware/user.middleware");
const { UserModel } = require("../models/user.model");
// const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRoute.post("/register", userPresent, async (req, res) => {
  const { firstname, lastname, mobile, email, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const data = new UserModel({
        firstname,
        lastname,
        mobile,
        email,
        password: hash,
      });
      await data.save();
      res.status(200).send({ msg: "User Register Successfully" });
    });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

//LOGIN
userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login Successfully",
            token: jwt.sign({ userId: user._id }, "jivak"),
            firstname: user.firstname,
          });
        } else {
          res.status(400).send({ err: "Wrong Credential" });
        }
      });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, username, password, conformpassword } = req.body;
    if (!name) {
      return res.status(400).send({ message: "name is required" });
    }
    if (!email) {
      return res.status(400).send({ message: "email is required" });
    }
    if (!username) {
      return res.status(400).send({ message: "username is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "password is required" });
    }
    if (!conformpassword) {
      return res.status(400).send({ message: "conformpassword is required" });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .send({ message: "email is already exist please signup" });
    }
    const existusername = await userModel.findOne({ username });
    if (userExist) {
      return res
        .status(400)
        .send({ message: "username is already exist please signup" });
    }
    bcrypt.hash(password, 7, async (error, hash) => {
      if (error) {
        console.log("bcrypt", error);
        return res.status(500).send({ message: "something went wrong" });
      }
      const user = new userModel({ name, email, username, password: hash });
      await user.save();
      res.status(200).send({ message: "register seccessfully" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong " });
  }
});
productRouter.get("/sorting", async (req, res) => {
  try {
    const { sort } = req.query;
    const query = ProductModel.find();
    if (sort === "asc") {
      query.sort({ rating: 1 });
    } else if (sort === "dsc") {
      query.sort({ rating: -1 });
    } else if (sort === "lowtohigh") {
      query.sort({ price: 1 });
    } else if (sort === "hightolow") {
      query.sort({ price: -1 });
    }

    const data = await query.exec();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
