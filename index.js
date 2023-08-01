// tic-toe
const cells = Array.from(document.querySelectorAll(".grid-cell"));
const currentPlayer = document.querySelector(".current-player");
const gameOverText = document.querySelector(".game-over-text");
const restartButton = document.querySelector(".restart");

let isGameActive = true;
let currentPlayerSymbol = "x";
let board = ["", "", "", "", "", "", "", "", ""];

function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = parseInt(cell.getAttribute("data-value"));

  if (cell.textContent || !isGameActive) {
    return;
  }

  cell.textContent = currentPlayerSymbol;
  cell.classList.add(currentPlayerSymbol);

  board[cellIndex] = currentPlayerSymbol;

  if (checkWin(currentPlayerSymbol)) {
    gameOver(currentPlayerSymbol + " wins!");
  } else if (checkDraw()) {
    gameOver("Draw!");
  } else {
    currentPlayerSymbol = currentPlayerSymbol === "x" ? "o" : "x";
    currentPlayer.textContent =
      "It's " + currentPlayerSymbol.toUpperCase() + "'s turn";
  }
}
function checkWin(player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some((combination) => {
    return combination.every((index) => board[index] === player);
  });
}

function checkDraw() {
  return board.every((cell) => cell !== "");
}

function gameOver(result) {
  isGameActive = false;
  gameOverText.textContent = result;
}

function restartGame() {
  isGameActive = true;
  currentPlayerSymbol = "x";
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
  currentPlayer.textContent = "It's X's turn";
  gameOverText.textContent = "";
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
restartButton.addEventListener("click", restartGame);

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

function clearPrevious(checkbox) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      if (i > 0) {
        checkboxes[i - 1].checked = false;
      }
      break;
    }
  }
}

function getproduct(url) {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("res = ", res);
      products = res;
      totalProductList.innerText = res.length;
      postData = document.getElementById("results");
      let arr = res;
      let disp = displayData(arr);
      postData.innerHTML = disp;
      // passCardData
      var elements = document.getElementsByClassName("addToCart");
      console.log("elements =", elements);
      var myFunction = function () {
        var attribute = this.getAttribute("id");
        console.log("attribute =", attribute);
        const carddata = arr.filter((item) => {
          return attribute == item._id;
        });
        console.log("carddata =", carddata[0]);
        addCardInList(carddata[0]);
      };

      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", myFunction, false);
      }
    })
    .catch((err) => console.log(err));
}
// ********************* login *************************
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    if (!username) {
      return res.status(400).send({ message: "put username" });
    }
    if (!password) {
      return res.status(400).send({ message: "put password" });
    }
    const user = await userModel.findOne({ username });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          const accesstoken = jwt.sign({ username }, "khirod", {
            expiresIn: "6h",
          });
          const refreshtoken = jwt.sign({ username }, "shreyansh", {
            expiresIn: "24h",
          });
          res.cookie("accessToken", accesstoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.cookie("refreshToken", refreshtoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res
            .status(200)
            .send({ message: "login syccessfull", token: accesstoken });
        } else {
          return res.status(400).send({ message: "wrong password" });
        }
      });
    } else {
      return res.status(400).send({ message: "put correct email id" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
});

// ************ refreshtoken ************
router.get("/refreshtoken", async (req, res) => {
  const refreshtoken = req.cookies.refreshToken;
  try {
    const isblacklist = await blacklistModel.findOne({
      refreshToken: refreshtoken,
    });
    if (isblacklist) return res.status(400).send({ msg: "Please login" });
    if (refreshtoken) {
      const isvalid = jwt.verify(refreshtoken, "shreyansh");
      console.log(isvalid);
      if (isvalid) {
        const newaccesstoken = jwt.sign({ email: isvalid.email }, "khirod", {
          expiresIn: "6h",
        });
        res.cookie("accessToken", newaccesstoken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send(newaccesstoken);
      }
    } else {
      res.status(400).send({ message: "please login" });
    }
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message });
  }
});

// ****************logout***************

router.get("/logout", authenticate, async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log(accessToken, refreshToken);
  const Baccesstoken = new blacklistModel({ accessToken });
  await Baccesstoken.save();
  const Brefreshtoken = new blacklistModel({ refreshToken });
  await Brefreshtoken.save();
  res.status(200).send({ message: "logout successfull" });
});

const express = require("express");
const appss = express();
const socketio = require("socket.io");

const mongoose = require("mongoose");
var randomId = require("random-id");
const { User, update_word_function } = require("./user");
let { users } = require("./user");
let cors = require("cors");
let { connection } = require("./Database/db");
let { router } = require("./Controller/user.rout");

app.use(cors());
app.use(express.json());
require("dotenv").config();
app.use("/user", router);
async function printUsers(Users) {
  const users = await Users.findAll();
  console.log(users);
}

for (let i = str.length; i > 0; i--) {
  new_str = new_str + str[i];
}
if (new_str == str) {
  console.log("it is palindrome");
} else {
  console.log("it is not palindrome");
}
const express = require("express");
const { userPresent } = require("../middleware/user.middleware");
const { UserModel } = require("../models/user.model");
const userRoutejk = express.Router();
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

userRoute.get("/name", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      console.log(user.firstname, user.lastname, user.email);
      res.status(200).send({
        token: jwt.sign({ userId: user._id }, "jivak"),
      });
    } else {
      res.status(400).send({ err: "Wrong email" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

for (let i = 1; i <= num; i++) {
  if (num % i == 0) {
    count++;
  }
}
if (count == 2) {
  console.log("it is prime");
} else {
  console.log("it is not prime");
}

for (let i = str.length; i > 0; i--) {
  new_str = new_str + str[i];
}
if (new_str == str) {
  console.log("it is palindrome");
} else {
  console.log("it is not palindrome");
}
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

userRoute.get("/name", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      console.log(user.firstname, user.lastname, user.email);
      res.status(200).send({
        token: jwt.sign({ userId: user._id }, "jivak"),
      });
    } else {
      res.status(400).send({ err: "Wrong email" });
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

function clearPrevious(checkbox) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      if (i > 0) {
        checkboxes[i - 1].checked = false;
      }
      break;
    }
  }
}

function getproduct(url) {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("res = ", res);
      products = res;
      totalProductList.innerText = res.length;
      postData = document.getElementById("results");
      let arr = res;
      let disp = displayData(arr);
      postData.innerHTML = disp;
      // passCardData
      var elements = document.getElementsByClassName("addToCart");
      console.log("elements =", elements);
      var myFunction = function () {
        var attribute = this.getAttribute("id");
        console.log("attribute =", attribute);
        const carddata = arr.filter((item) => {
          return attribute == item._id;
        });
        console.log("carddata =", carddata[0]);
        addCardInList(carddata[0]);
      };

      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", myFunction, false);
      }
    })
    .catch((err) => console.log(err));
}
// ********************* login *************************
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    if (!username) {
      return res.status(400).send({ message: "put username" });
    }
    if (!password) {
      return res.status(400).send({ message: "put password" });
    }
    const user = await userModel.findOne({ username });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          const accesstoken = jwt.sign({ username }, "khirod", {
            expiresIn: "6h",
          });
          const refreshtoken = jwt.sign({ username }, "shreyansh", {
            expiresIn: "24h",
          });
          res.cookie("accessToken", accesstoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.cookie("refreshToken", refreshtoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res
            .status(200)
            .send({ message: "login syccessfull", token: accesstoken });
        } else {
          return res.status(400).send({ message: "wrong password" });
        }
      });
    } else {
      return res.status(400).send({ message: "put correct email id" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
});

// ************ refreshtoken ************
router.get("/refreshtoken", async (req, res) => {
  const refreshtoken = req.cookies.refreshToken;
  try {
    const isblacklist = await blacklistModel.findOne({
      refreshToken: refreshtoken,
    });
    if (isblacklist) return res.status(400).send({ msg: "Please login" });
    if (refreshtoken) {
      const isvalid = jwt.verify(refreshtoken, "shreyansh");
      console.log(isvalid);
      if (isvalid) {
        const newaccesstoken = jwt.sign({ email: isvalid.email }, "khirod", {
          expiresIn: "6h",
        });
        res.cookie("accessToken", newaccesstoken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send(newaccesstoken);
      }
    } else {
      res.status(400).send({ message: "please login" });
    }
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message });
  }
});

// ****************logout***************

router.get("/logout", authenticate, async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log(accessToken, refreshToken);
  const Baccesstoken = new blacklistModel({ accessToken });
  await Baccesstoken.save();
  const Brefreshtoken = new blacklistModel({ refreshToken });
  await Brefreshtoken.save();
  res.status(200).send({ message: "logout successfull" });
});
const express = require("express");
const socketio = require("socket.io");

const mongoose = require("mongoose");
var randomId = require("random-id");
const { User, update_word_function } = require("./user");
let { users } = require("./user");
let cors = require("cors");
let { connection } = require("./Database/db");
let { router } = require("./Controller/user.rout");

app.use(cors());
app.use(express.json());
require("dotenv").config();
app.use("/user", router);
async function printUsers(Users) {
  const users = await Users.findAll();
  console.log(users);
}

for (let i = str.length; i > 0; i--) {
  new_str = new_str + str[i];
}
if (new_str == str) {
  console.log("it is palindrome");
} else {
  console.log("it is not palindrome");
}
const express = require("express");
const { userPresent } = require("../middleware/user.middleware");
const { UserModel } = require("../models/user.model");
const routekela = express.Router();
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

userRoute.get("/name", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      console.log(user.firstname, user.lastname, user.email);
      res.status(200).send({
        token: jwt.sign({ userId: user._id }, "jivak"),
      });
    } else {
      res.status(400).send({ err: "Wrong email" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

for (let i = 1; i <= num; i++) {
  if (num % i == 0) {
    count++;
  }
}
if (count == 2) {
  console.log("it is prime");
} else {
  console.log("it is not prime");
}

for (let i = str.length; i > 0; i--) {
  new_str = new_str + str[i];
}
if (new_str == str) {
  console.log("it is palindrome");
} else {
  console.log("it is not palindrome");
}
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

userRoute.get("/name", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      console.log(user.firstname, user.lastname, user.email);
      res.status(200).send({
        token: jwt.sign({ userId: user._id }, "jivak"),
      });
    } else {
      res.status(400).send({ err: "Wrong email" });
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

// ********************* login *************************
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    if (!username) {
      return res.status(400).send({ message: "put username" });
    }
    if (!password) {
      return res.status(400).send({ message: "put password" });
    }
    const user = await userModel.findOne({ username });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          const accesstoken = jwt.sign({ username }, "khirod", {
            expiresIn: "6h",
          });
          const refreshtoken = jwt.sign({ username }, "shreyansh", {
            expiresIn: "24h",
          });
          res.cookie("accessToken", accesstoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.cookie("refreshToken", refreshtoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res
            .status(200)
            .send({ message: "login syccessfull", token: accesstoken });
        } else {
          return res.status(400).send({ message: "wrong password" });
        }
      });
    } else {
      return res.status(400).send({ message: "put correct email id" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
});

// ************ refreshtoken ************
router.get("/refreshtoken", async (req, res) => {
  const refreshtoken = req.cookies.refreshToken;
  try {
    const isblacklist = await blacklistModel.findOne({
      refreshToken: refreshtoken,
    });
    if (isblacklist) return res.status(400).send({ msg: "Please login" });
    if (refreshtoken) {
      const isvalid = jwt.verify(refreshtoken, "shreyansh");
      console.log(isvalid);
      if (isvalid) {
        const newaccesstoken = jwt.sign({ email: isvalid.email }, "khirod", {
          expiresIn: "6h",
        });
        res.cookie("accessToken", newaccesstoken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send(newaccesstoken);
      }
    } else {
      res.status(400).send({ message: "please login" });
    }
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message });
  }
});

// ****************logout***************

router.get("/logout", authenticate, async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log(accessToken, refreshToken);
  const Baccesstoken = new blacklistModel({ accessToken });
  await Baccesstoken.save();
  const Brefreshtoken = new blacklistModel({ refreshToken });
  await Brefreshtoken.save();
  res.status(200).send({ message: "logout successfull" });
});
const { userPresent } = require("../middleware/user.middleware");
const { UserModel } = require("../models/user.model");

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

userRoute.get("/name", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      console.log(user.firstname, user.lastname, user.email);
      res.status(200).send({
        token: jwt.sign({ userId: user._id }, "jivak"),
      });
    } else {
      res.status(400).send({ err: "Wrong email" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

userRoute.patch("/sign", userPresent, async (req, res) => {
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
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { Sequelize, DataTypes } = require("sequelize");

async function connectToRDS() {
  const sequelize = new Sequelize("rdsTest", "admin", "abcd1234", {
    host: "database-1.cjrbkjkvr8eq.eu-north-1.rds.amazonaws.com",
    dialect: "mysql",
  });
  try {
    await sequelize.authenticate();
    console.log("Connected to RDS successfully!!");
  } catch (err) {
    console.log("Unable to Connect!!!");
  }

  const Users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  await printUsers(Users);
}

async function printUsers(Users) {
  const users = await Users.findAll();
  console.log(users);
}

export const handler = async (event) => {
  // TODO implement
  await connectToRDS();
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};

const io = socketio(expressServer);

//my global array or clients
// let arr = [];

// here is my ranodom paragraph
let para = [
  "The train leaves every morning at 8AM.",
  "Tomorrow early morning first I go to morning walk.",
  "I and my sister dont see each other anymore.",
];

//on connect

let totalWords = 0;

io.on("connection", (socket) => {
  count += 1;

  socket.on("username", ({ username }) => {
    var id = randomId(len, pattern);
    console.log(id);
    socket.emit("roomno", id);
  });
  let Room;
  socket.on("joinroom", ({ username, roomvalue }) => {
    const user = User(socket.id, username, roomvalue);
    console.log(roomvalue + "from join room");
    console.log(socket.id + "from line no 68");
    socket.join(roomvalue);
    Room = roomvalue;
    io.emit("usersarray", users);
    socket.emit("message", "WELCOME TO RACE BUDDY 😉");
  });
  console.log(`One user connected, total user : ${count}`);

  socket.on("timeleft", (data) => {
    let { timeleft } = data;
    socket.broadcast.to(Room).emit("Time", { timeleft });
  });
  io.emit("user count", count);

  socket.on("display", (data) => {
    socket.broadcast.to(Room).emit("forall", data);
  });

  //emitting the paragraph
  let random = Math.floor(Math.random() * para.length);
  let myParagraph = para[random];
  socket.emit("thePara", myParagraph);

  //recieving the typed text from client
  socket.on("typedText", ({ typedText }) => {
    console.log(`person having id ${socket.id} is typing :`, typedText);

    if (
      typedText[typedText.length - 1] == myParagraph[typedText.length - 1] &&
      includeFunction(myParagraph, typedText)
    ) {
      if (typedText.length == myParagraph.length) {
        console.log(typedText);
        // users = []
        return socket.emit("typing-update", {
          typedText: "You have finished the race buddy 👏👏👏",
          flag: "Race Completed",
        });
      }
      if (typedText[typedText.length - 1] == " ") {
        let user = update_word_function(socket.id, typedText);
        console.log(user);
        console.log(user[0]);
        io.to(user[0].roomvalue).emit("user_data", user[0]);
      }
      // console.log({ typedText, keyCode });
      socket.emit("typing-update", {
        typedText,

        isTyping: true,
        socketID: socket.id,
        flag: true,
        totalWords,
      });
    } else {
      socket.emit("typing-update", {
        typedText,
        isTyping: false,
        socketID: socket.id,
        flag: false,
        totalWords,
      });
    }
  });
  //disconnet
  socket.on("disconnect", () => {
    count -= 1;
    console.log(`One user left, ${count} remaining!!`);
    io.emit("user count", count);
  });
});

/*Here I am checking includes */
const includeFunction = (myParagraph, typedText) => {
  if (myParagraph.includes(typedText)) {
    return true;
  } else {
    return false;
  }
};
productRouter.get("/", async (req, res) => {
  try {
    const product = await ProductModel.find();
    res.status(200).send(product);
  } catch (err) {
    res.send({ msg: err.message });
  }
});

productRouter.get("/model", async (req, res) => {
  const filters = {};
  if (req.query.shape) {
    filters.shape = { $regex: req.query.shape, $options: "i" };
  }

  if (req.query.colors) {
    filters.colors = { $regex: req.query.colors, $options: "i" };
  }

  const data = await ProductModel.find(filters).sort({
    price: req.query.price === "asc" ? 1 : -1,
  });
  res.send(data);
});

productRouter.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const newProduct = new ProductModel(payload);
    await newProduct.save();
    res.status(200).send({ message: "New Products successfully Added" });
  } catch (err) {
    console.log("err=", err);
    res.status(400).send({ msg: err });
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

function clearPrevious(checkbox) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      if (i > 0) {
        checkboxes[i - 1].checked = false;
      }
      break;
    }
  }
}
// Sorting By Various Method
const mySelect = document.getElementById("select");
mySelect.addEventListener("change", function () {
  const selectedOption = this.value;

  if (selectedOption === "asc") {
    getSortProduct("asc");
  } else if (selectedOption === "dsc") {
    getSortProduct("dsc");
  } else if (selectedOption === "lowtohigh") {
    getSortProduct("lowtohigh");
  } else if (selectedOption === "hightolow") {
    getSortProduct("hightolow");
  }
});

function getproduct(url) {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("res = ", res);
      products = res;
      totalProductList.innerText = res.length;
      postData = document.getElementById("results");
      let arr = res;
      let disp = displayData(arr);
      postData.innerHTML = disp;
      // passCardData
      var elements = document.getElementsByClassName("addToCart");
      console.log("elements =", elements);
      var myFunction = function () {
        var attribute = this.getAttribute("id");
        console.log("attribute =", attribute);
        const carddata = arr.filter((item) => {
          return attribute == item._id;
        });
        console.log("carddata =", carddata[0]);
        addCardInList(carddata[0]);
      };

      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", myFunction, false);
      }
    })
    .catch((err) => console.log(err));
}

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

function clearPrevious(checkbox) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      if (i > 0) {
        checkboxes[i - 1].checked = false;
      }
      break;
    }
  }
}

function getproduct(url) {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("res = ", res);
      products = res;
      totalProductList.innerText = res.length;
      postData = document.getElementById("results");
      let arr = res;
      let disp = displayData(arr);
      postData.innerHTML = disp;
      // passCardData
      var elements = document.getElementsByClassName("addToCart");
      console.log("elements =", elements);
      var myFunction = function () {
        var attribute = this.getAttribute("id");
        console.log("attribute =", attribute);
        const carddata = arr.filter((item) => {
          return attribute == item._id;
        });
        console.log("carddata =", carddata[0]);
        addCardInList(carddata[0]);
      };

      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", myFunction, false);
      }
    })
    .catch((err) => console.log(err));
}
// ********************* login *************************
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    if (!username) {
      return res.status(400).send({ message: "put username" });
    }
    if (!password) {
      return res.status(400).send({ message: "put password" });
    }
    const user = await userModel.findOne({ username });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          const accesstoken = jwt.sign({ username }, "khirod", {
            expiresIn: "6h",
          });
          const refreshtoken = jwt.sign({ username }, "shreyansh", {
            expiresIn: "24h",
          });
          res.cookie("accessToken", accesstoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.cookie("refreshToken", refreshtoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res
            .status(200)
            .send({ message: "login syccessfull", token: accesstoken });
        } else {
          return res.status(400).send({ message: "wrong password" });
        }
      });
    } else {
      return res.status(400).send({ message: "put correct email id" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
});

// ************ refreshtoken ************
router.get("/refreshtoken", async (req, res) => {
  const refreshtoken = req.cookies.refreshToken;
  try {
    const isblacklist = await blacklistModel.findOne({
      refreshToken: refreshtoken,
    });
    if (isblacklist) return res.status(400).send({ msg: "Please login" });
    if (refreshtoken) {
      const isvalid = jwt.verify(refreshtoken, "shreyansh");
      console.log(isvalid);
      if (isvalid) {
        const newaccesstoken = jwt.sign({ email: isvalid.email }, "khirod", {
          expiresIn: "6h",
        });
        res.cookie("accessToken", newaccesstoken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send(newaccesstoken);
      }
    } else {
      res.status(400).send({ message: "please login" });
    }
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message });
  }
});

// ****************logout***************

router.get("/logout", authenticate, async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log(accessToken, refreshToken);
  const Baccesstoken = new blacklistModel({ accessToken });
  await Baccesstoken.save();
  const Brefreshtoken = new blacklistModel({ refreshToken });
  await Brefreshtoken.save();
  res.status(200).send({ message: "logout successfull" });
});

const express = require("express");
const app = express();
const socketio = require("socket.io");

const mongoose = require("mongoose");
var randomId = require("random-id");
const { User, update_word_function } = require("./user");
let { users } = require("./user");
let cors = require("cors");
let { connection } = require("./Database/db");
let { router } = require("./Controller/user.rout");

app.use(cors());
app.use(express.json());
require("dotenv").config();
app.use("/user", router);
async function printUsers(Users) {
  const users = await Users.findAll();
  console.log(users);
}
let str = "naman";

let new_str = "";

for (let i = str.length; i > 0; i--) {
  new_str = new_str + str[i];
}
if (new_str == str) {
  console.log("it is palindrome");
} else {
  console.log("it is not palindrome");
}
const express = require("express");
const { userPresent } = require("../middleware/user.middleware");
const { UserModel } = require("../models/user.model");
const userRoute = express.Router();
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

userRoute.get("/name", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      console.log(user.firstname, user.lastname, user.email);
      res.status(200).send({
        token: jwt.sign({ userId: user._id }, "jivak"),
      });
    } else {
      res.status(400).send({ err: "Wrong email" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});
let num = 13;
let count = 0;
for (let i = 1; i <= num; i++) {
  if (num % i == 0) {
    count++;
  }
}
if (count == 2) {
  console.log("it is prime");
} else {
  console.log("it is not prime");
}

for (let i = str.length; i > 0; i--) {
  new_str = new_str + str[i];
}
if (new_str == str) {
  console.log("it is palindrome");
} else {
  console.log("it is not palindrome");
}
const express = require("express");
const { userPresent } = require("../middleware/user.middleware");
const { UserModel } = require("../models/user.model");
const userRouter = express.Router();
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

userRoute.get("/name", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      console.log(user.firstname, user.lastname, user.email);
      res.status(200).send({
        token: jwt.sign({ userId: user._id }, "jivak"),
      });
    } else {
      res.status(400).send({ err: "Wrong email" });
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

// ********************* login *************************
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    if (!username) {
      return res.status(400).send({ message: "put username" });
    }
    if (!password) {
      return res.status(400).send({ message: "put password" });
    }
    const user = await userModel.findOne({ username });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          const accesstoken = jwt.sign({ username }, "khirod", {
            expiresIn: "6h",
          });
          const refreshtoken = jwt.sign({ username }, "shreyansh", {
            expiresIn: "24h",
          });
          res.cookie("accessToken", accesstoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.cookie("refreshToken", refreshtoken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res
            .status(200)
            .send({ message: "login syccessfull", token: accesstoken });
        } else {
          return res.status(400).send({ message: "wrong password" });
        }
      });
    } else {
      return res.status(400).send({ message: "put correct email id" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "something went wrong" });
  }
});

// ************ refreshtoken ************
router.get("/refreshtoken", async (req, res) => {
  const refreshtoken = req.cookies.refreshToken;
  try {
    const isblacklist = await blacklistModel.findOne({
      refreshToken: refreshtoken,
    });
    if (isblacklist) return res.status(400).send({ msg: "Please login" });
    if (refreshtoken) {
      const isvalid = jwt.verify(refreshtoken, "shreyansh");
      console.log(isvalid);
      if (isvalid) {
        const newaccesstoken = jwt.sign({ email: isvalid.email }, "khirod", {
          expiresIn: "6h",
        });
        res.cookie("accessToken", newaccesstoken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send(newaccesstoken);
      }
    } else {
      res.status(400).send({ message: "please login" });
    }
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message });
  }
});

// ****************logout***************

router.get("/logout", authenticate, async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log(accessToken, refreshToken);
  const Baccesstoken = new blacklistModel({ accessToken });
  await Baccesstoken.save();
  const Brefreshtoken = new blacklistModel({ refreshToken });
  await Brefreshtoken.save();
  res.status(200).send({ message: "logout successfull" });
});
const { userPresent } = require("../middleware/user.middleware");
const { UserModel } = require("../models/user.model");

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
const videoRouter = express.Router();

// post video

videoRouter.post("/upload/video", async (req, res) => {
  try {
    const { name, description, category, adminID, creatorName, email } =
      req.body;
    const { image, video } = req.files;

    const videoResult = await uploadVideoToCloudinary(video);
    const imageResult = await uploadImageToCloudinary(image);

    console.log(`Uploaded`);
    const adminObjectId = mongoose.Types.ObjectId.isValid(adminID)
      ? new mongoose.Types.ObjectId(adminID)
      : null;

    console.log(adminObjectId);
    const newVideo = new VideoModel({
      name,
      videoURL: videoResult.url,
      thumbnailURL: imageResult.url,
      description,
      category,
      adminID: adminObjectId,
      creatorName,
    });

    console.log("newVideo");

    // Save the video object to the database
    const savedVideo = await newVideo.save();

    const utcTimestamp = videoResult.created_at;
    const istTime = convertUTCtoIST(utcTimestamp);

    const text = `Dear ${creatorName},

        Congratulations! Your video has been successfully uploaded to our platform. We're thrilled to have your valuable content on board.
        
        Video Details:
        Video Name: ${name}
        Category: ${category}
        Created At: ${istTime}

        Check your video: ${videoResult.url}
        
        Your video is now live and visible to our community. We believe your content will inspire, educate, and entertain our audience, and we can't wait to see the engagement it receives.
        
        If you have any questions or need any assistance with managing your videos or courses, feel free to reach out to our support team at support@skilcraft.com. We're here to help you make the most of your experience on our platform.
        
        Thank you for choosing our platform to share your expertise with the world. We value your contribution to our community and look forward to seeing more exciting content from you in the future.
        
        Keep up the great work!
        
        Best regards,
        The Skilcraft Team`;

    // Construct the email details
    let details = {
      from: "admin@skilcraft.com",
      to: email,
      subject: "Video uploaded successfully",
      text: text,
    };

    // Send the email
    const emailResponse = await sendEmail(details);
    console.log("Email sent:", emailResponse);

    res.status(201).json({
      isError: false,
      message: "Video uploaded successfully",
      video: savedVideo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: true, message: error.message });
  }
});
function uploadVideoToCloudinary(file) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { resource_type: "video" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}
function uploadImageToCloudinary(file) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file.tempFilePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
async function sendEmail(details) {
  const response = await fetch(
    "https://tiny-lime-jay-coat.cyclic.app/send-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    }
  );

  const data = await response.json();
  return data;
}
function convertUTCtoIST(timestamp) {
  const dateObj = new Date(timestamp);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");
  let amOrPm = "AM";

  if (hours >= 12) {
    amOrPm = "PM";
    hours %= 12;
  }

  hours = String(hours).padStart(2, "0");

  const istTimestamp = `Time: ${hours}:${minutes}:${seconds} ${amOrPm}\nDate: ${day}-${month}-${year}`;
  return istTimestamp;
}

// get single video
videoRouter.get("/get/video/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const video = await VideoModel.findById(id);

    res.status(200).json({ isError: false, video });
  } catch (error) {
    res.status(500).json({ isError: true, message: error.message });
  }
});

// get all videos
videoRouter.get("/get/video", async (req, res) => {
  try {
    const videos = await VideoModel.find({ courseID: null });

    res.status(200).json({ isError: false, videos });
  } catch (error) {
    res.status(500).json({ isError: true, message: error.message });
  }
});

// get all admin videos
videoRouter.get("/get/videos/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const videos = await VideoModel.find({
      adminID: adminId,
      courseID: null,
    });

    res.status(200).json({ isError: false, videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isError: true,
      message: "Error retrieving videos",
    });
  }
});

// get all coursesVideo
videoRouter.get("/get/coursesVideo/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const videos = await VideoModel.find({ courseID: id });

    res.status(200).json({ isError: false, videos });
  } catch (error) {
    res.status(500).json({ isError: true, message: error.message });
  }
});

// get by categories
videoRouter.get("/get/byCategories", async (req, res) => {
  const categories = req.query.categories;

  try {
    let videos;
    if (categories) {
      const categoryArray = categories.split(",");

      // Convert the category names to regular expressions for case-insensitive search
      const regexArray = categoryArray.map(
        (category) => new RegExp(category, "i")
      );

      videos = await VideoModel.find({ category: { $in: regexArray } });
    } else {
      videos = await VideoModel.find();
    }

    res.status(200).json({ isError: false, videos });
  } catch (error) {
    res.status(500).json({
      isError: true,
      message: "Error fetching videos",
      error: error.message,
    });
  }
});

// add coursesVideo
videoRouter.put("/update/video/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const { courseID } = req.body;

  try {
    const updatedVideo = await VideoModel.findByIdAndUpdate(
      videoId,
      { courseID: courseID ? mongoose.Types.ObjectId(courseID) : null },
      { new: true }
    );

    if (!updatedVideo) {
      return res
        .status(404)
        .json({ isError: true, message: "Video not found" });
    }

    res.status(200).json({
      isError: false,
      video: updatedVideo,
      message: "Video added to Course",
    });
  } catch (error) {
    res.status(500).json({ isError: true, message: error.message });
  }
});

// add from courses
videoRouter.put("/removeCourse/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await VideoModel.findById(videoId);

    if (!video) {
      return res
        .status(404)
        .json({ isError: true, message: "Video not found" });
    }

    video.courseID = null;
    await video.save();

    res.status(200).json({
      isError: false,
      message: "CourseID updated to null for the video",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isError: true,
      message: "Error updating courseID",
    });
  }
});

// update details
videoRouter.put("/update/details/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const { name, description, category } = req.body;

  try {
    const updatedVideo = await VideoModel.findByIdAndUpdate(
      videoId,
      {
        name,
        description,
        category,
      },
      { new: true }
    );

    if (!updatedVideo) {
      return res
        .status(404)
        .json({ isError: true, message: "Video not found" });
    }

    res.status(200).json({
      isError: false,
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    res.status(500).json({ isError: true, message: error.message });
  }
});

// update like
videoRouter.put("/update/like/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const { action } = req.body;

  try {
    const video = await VideoModel.findById(videoId);

    if (!video) {
      return res
        .status(404)
        .json({ isError: true, message: "Video not found" });
    }

    if (action === "increment") {
      video.likes++;
    } else if (action === "decrement") {
      video.likes--;
    } else {
      return res.status(400).json({ isError: true, message: "Invalid action" });
    }

    const updatedVideo = await video.save();

    res.status(200).json({
      isError: false,
      message: "Likes updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    res.status(500).json({ isError: true, message: error.message });
  }
});

// post comment
videoRouter.put("/post/comment/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const { comment } = req.body;

  try {
    const video = await VideoModel.findById(videoId);

    if (!video) {
      return res
        .status(404)
        .json({ isError: true, message: "Video not found" });
    }

    video.comments.push(comment);

    const updatedVideo = await video.save();

    res.status(201).json({
      isError: false,
      message: "Comment posted successfully",
      video: updatedVideo,
    });
  } catch (error) {
    res.status(500).json({ isError: true, message: error.message });
  }
});

// delete the video
videoRouter.delete("/delete/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  try {
    const deletedVideo = await VideoModel.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return res
        .status(404)
        .json({ isError: true, message: "Video not found" });
    }

    res.status(200).json({
      isError: false,
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ isError: true, message: error.message });
  }
});

module.exports = {
  videoRouter,
};

productRouter.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const newProduct = new ProductModel(payload);
    await newProduct.save();
    res.status(200).send({ message: "New Products successfully Added" });
  } catch (err) {
    console.log("err=", err);
    res.status(400).send({ msg: err });
  }
});

function clearPrevious(checkbox) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      if (i > 0) {
        checkboxes[i - 1].checked = false;
      }
      break;
    }
  }
}

// Sorting By Various Method
const mySelects = document.getElementById("select");
mySelect.addEventListener("change", function () {
  const selectedOption = this.value;

  if (selectedOption === "asc") {
    getSortProduct("asc");
  } else if (selectedOption === "dsc") {
    getSortProduct("dsc");
  } else if (selectedOption === "lowtohigh") {
    getSortProduct("lowtohigh");
  } else if (selectedOption === "hightolow") {
    getSortProduct("hightolow");
  }
});

function getproduct(url) {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("res = ", res);
      products = res;
      totalProductList.innerText = res.length;
      postData = document.getElementById("results");
      let arr = res;
      let disp = displayData(arr);
      postData.innerHTML = disp;
      // passCardData
      var elements = document.getElementsByClassName("addToCart");
      console.log("elements =", elements);
      var myFunction = function () {
        var attribute = this.getAttribute("id");
        console.log("attribute =", attribute);
        const carddata = arr.filter((item) => {
          return attribute == item._id;
        });
        console.log("carddata =", carddata[0]);
        addCardInList(carddata[0]);
      };

      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", myFunction, false);
      }
    })
    .catch((err) => console.log(err));
}

function getCalendar(year, month) {
  const options = { year: "numeric", month: "long" };
  const date = new Date(year, month - 1, 1);
  const header = date.toLocaleDateString("en-US", options);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const calArray = [...Array(42)].map((_, index) => {
    const dayOfMonth = index - firstDayOfWeek + 1;
    if (dayOfMonth >= 1 && dayOfMonth <= daysInMonth) {
      return dayOfMonth.toString().padStart(2, " ");
    } else {
      return "  ";
    }
  });

  let calendar = `${header}\nSu Mo Tu We Th Fr Sa\n`;
  for (let i = 0; i < 6; i++) {
    const row = calArray.slice(i * 7, (i + 1) * 7).join(" ");
    calendar += `${row}\n`;
  }

  return calendar;
}
getCalendar(2000, 3);
