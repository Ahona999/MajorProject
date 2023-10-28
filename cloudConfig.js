const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//Attaching cloudinary acc. with our backend ----> env files//
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({//fOR STORING FILES SIMILAR AS WE DO IT IN GDRIVE FOR ST0RING FILES IN A FOLDER
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      alllowedFormats: ["jpeg", "png", "jpg"],
    },
  });


  module.exports = {
    cloudinary,
    storage,
  };