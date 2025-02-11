import multer from "multer";

const storage = multer.diskStorage({
  destination: "public/files",
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fidexName = originalName.replace(/\s+/g, "_");
    cb(null, fidexName);
  },
});

export default multer({ storage });