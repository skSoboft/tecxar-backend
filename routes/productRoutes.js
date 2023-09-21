const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { ensureAuthenticated } = require("../controllers/authController");
const {
  productValidation,
} = require("../utils/validations/registerValidation");

const uploadProductImage = require("../middlewares/multerMiddleware").single(
  "productImage"
);

router.post(
  "/",
  ensureAuthenticated,
  //productValidation,
  uploadProductImage,
  productController.create
);

router.put(
  "/:id",
  ensureAuthenticated,
  uploadProductImage,
  productController.update
);

router.delete("/:id", ensureAuthenticated, productController.delete);

router.get("/", productController.list);

module.exports = router;
