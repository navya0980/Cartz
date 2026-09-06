import express from "express";
const router=express.Router();
import { isAuthenticated,isAdmin } from "../middlewares/isAuthenticated.js";
import ExpressError from "../utils/ExpressError.js";
import { multipleUpload, singleUpload } from "../middlewares/multer.js";
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/productController.js";

router.post("/add",isAuthenticated,isAdmin,multipleUpload,addProduct);
router.get("/products",getAllProduct);
router.delete("/delete/:productId",isAuthenticated,isAdmin,deleteProduct);
router.put("/update/:productId",isAuthenticated,isAdmin,multipleUpload,updateProduct);

export default router;