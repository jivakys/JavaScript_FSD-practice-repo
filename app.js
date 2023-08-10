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
