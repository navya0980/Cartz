import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const singleUpload = upload.single("file");
//multiple upload

export const multipleUpload=upload.array("files",5);