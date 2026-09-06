import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import ExpressError from "../utils/ExpressError.js";

export const addProduct = async (req, res, next) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;

    if (!productName || !productDesc || !productPrice) {
      return next(new ExpressError("All fields are required", 400));
    }

    //Handle multiple image uploads
    let productImg = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "cartz_products",
        });
        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg,
    });

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return next(new ExpressError(error.message, 500));
  }
};

export const getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "No products available",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ExpressError(error.message, 500));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ExpressError("Product not found", 404));
    }
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.public_id);
      }
    }
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(new ExpressError(error.message, 500));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ExpressError("Product not found", 404));
    }
    let updatedImages = [];

    // keep selected old images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);

      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );

      // delete only removed images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );

      for (let img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = product.productImg; // keep all if nothing sent
    }

    // upload new images if any
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "cartz_products",
        });

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    const updateFields = [
      "productName",
      "productDesc",
      "productPrice",
      "category",
      "brand",
    ];

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });
    // assign updated images to product
    product.productImg = updatedImages;
    await product.save();
    return res.status(200).json({
      success:true,
      message:"Product updated successfully",
      product
    })
  } catch (error) {
    return next(new ExpressError(error.message, 500));
  }
};
