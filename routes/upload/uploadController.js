const cloudinary = require("cloudinary");
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//for removing temp files from backend/temp folder
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

//uploading files to cloudinary
const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: path,
      },
      (err, res) => {
        if (err) {
          removeTmp(file.tempFilePath);
          return res.status(400).json({ message: "Upload image failed." });
        }
        resolve({
          url: res.secure_url,
        });
      }
    );
  });
};

//file uploading funcion..
const uploadImages = async (req, res) => {
  try {
    const { path } = req.body;
    let files = Object.values(req.files).flat();
    let images = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file, path);
      images.push(url);
      removeTmp(file.tempFilePath);
    }
    res.json(images);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//GET IMAGES FROM CLOUDINARY
const getImages = async (req, res) => {
  try {
    const { path, sort, max } = req.body;

    cloudinary.v2.search
      .expression(`${path}`)
      .sort_by("created_at", `${sort}`)
      .max_results(max)
      .execute()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadImages,
  getImages,
};
