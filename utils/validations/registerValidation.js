const { body, validationResult } = require('express-validator');

const registrationValidation = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("mobile").isMobilePhone("any").withMessage("Invalid mobile number"),
];

const productValidation = [
    body('productName').notEmpty().withMessage('Product name is required'),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isNumeric()
      .withMessage('Price must be a number'),
    body('categoryId').notEmpty().withMessage('Category ID is required'),
  ];

module.exports = {registrationValidation, productValidation};