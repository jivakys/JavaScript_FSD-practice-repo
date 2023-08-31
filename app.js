// nnn
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
  } catch (err) {
    throw err;
  }
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
