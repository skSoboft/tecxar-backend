const db = require("../db");

exports.create = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const query = "INSERT INTO category (name) VALUES (?)";

  db.query(query, [name], (err, results) => {
    if (err) {
      console.error("Error creating category:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const newCategoryId = results.insertId;

    const newCategory = {
      id: newCategoryId,
      name,
    };

    res.status(201).json(newCategory);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const query = "UPDATE category SET name = ? WHERE id = ?";

  db.query(query, [name, id], (err, results) => {
    if (err) {
      console.error("Error updating category:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = {
      id: parseInt(id),
      name,
    };

    res.json(updatedCategory);
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM category WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting category:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.sendStatus(204);
  });
};

exports.list = (req, res) => {
  const query = "SELECT * FROM category";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error listing categories:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json(results);
  });
};
