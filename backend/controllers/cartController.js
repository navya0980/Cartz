import ExpressError from "../utils/ExpressError.js";
import Cart from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res, next) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.json({ success: true, cart: [] });
    }
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return next(new ExpressError(error.message, 500));
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.id;
    let { productId } = req.body;

    //check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ExpressError("Product not found", 404));
    }
    //find user cart if exists
    let cart = await Cart.findOne({ userId });
    //if cart doesnt exist create new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
            price: product.productPrice,
          },
        ],
        totalPrice: product.productPrice,
      });
    } else {
      // Find if product is already in the cart
      // Find if product is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        // If product exists -> just increase quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // If new product -> push to cart
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );
    return res.status(200).json({
      success: true,
      message: "Product Added Successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return next(new ExpressError(error.message, 500));
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (type === "increase") {
      item.quantity += 1;
    }

    if (type === "decrease") {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.items = cart.items.filter(
          (cartItem) => cartItem.productId.toString() !== productId,
        );
      }
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();

    cart = await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();
    cart = await cart.populate("items.productId");
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
