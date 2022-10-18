const profilePhotoResize = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profilePhotos/${req.file.filename}`));
  next();
};

module.exports = { profilePhotoResize };
