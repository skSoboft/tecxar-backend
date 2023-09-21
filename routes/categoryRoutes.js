const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");
router.get("/", categoryController.list);
router.post("/", authController.ensureAuthenticated, categoryController.create);

router.put(
  "/:id",
  authController.ensureAuthenticated,
  categoryController.update
);

router.delete(
  "/:id",
  authController.ensureAuthenticated,
  categoryController.delete
);

module.exports = router;
