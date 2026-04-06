import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body("username")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .matches(/^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/)

    .withMessage(
      "Email must contain a valid domain (example@gmail.com),(example@yahoo.com)",
    ),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
    .withMessage(
      "Password must have uppercase, lowercase, number, and special character",
    ),
  validate,
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

export { registerValidation, loginValidation, validate };
