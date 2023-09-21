const { validationResult } = require("express-validator");
const db = require("../db");
const upload = require("../middlewares/multerMiddleware");
const handleFileUpload = upload.single("productImage");

// Create a product
exports.create = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productName, price, categoryId } = req.body;
  console.log("req.file::" + req.file);
  const productImage = req.file ? req.file.filename : null;

  // Insert the new product into the database
  const query =
    "INSERT INTO product (name, price, category_id, image) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [productName, price, categoryId, productImage],
    (err, results) => {
      if (err) {
        console.error("Error creating product:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const newProductId = results.insertId;

      const newProduct = {
        id: newProductId,
        product_name: productName,
        price: price,
        category_id: categoryId,
        product_image: productImage,
      };

      return res.status(201).json(newProduct);
    }
  );
};

exports.update = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { productName, price, categoryId } = req.body;
  const productImage = req.file ? req.file.filename : null;

  if (!productName || !price || !categoryId) {
    return res
      .status(400)
      .json({ error: "Product name, price, and category ID are required" });
  }

  // Check if the product exists by its ID before updating
  const checkQuery = "SELECT * FROM product WHERE id = ?";
  db.query(checkQuery, [id], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error checking product:", checkErr);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (checkResults.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product in the database
    const updateQuery =
      "UPDATE product SET name = ?, price = ?, category_id = ?, image = ? WHERE id = ?";
    db.query(
      updateQuery,
      [productName, price, categoryId, productImage, id],
      (err, results) => {
        if (err) {
          console.error("Error updating product:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        const updatedProduct = {
          id: parseInt(id),
          name: productName,
          price: price,
          category_id: categoryId,
          image: productImage,
        };

        res.json(updatedProduct);
      }
    );
  });
};

// Delete a product
exports.delete = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM product WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.sendStatus(204);
  });
};

// List products
exports.list = (req, res) => {
  const query = "SELECT * FROM product";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error listing products:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json(results);
  });
};
