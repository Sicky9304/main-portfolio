import { Router } from "express";
import { body, validationResult } from "express-validator";
import Contact from "../models/Contact.js";
import { sendAdminNotification, sendUserAutoReply } from "../utils/email.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| POST /api/contact
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 100 }),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),

    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ max: 5000 }),
  ],

  async (req, res, next) => {
    try {
      // Validate request
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, email, message } = req.body;

      // Save into MongoDB
      const contact = await Contact.create({
        name,
        email,
        message,
      });

      console.log("✅ Contact saved to database");

      // Trigger background email operations (non-blocking for production performance)
      sendAdminNotification({ name, email, message }).catch((err) => {
        console.error("❌ Error sending admin notification:", err);
      });

      sendUserAutoReply({ name, email, message }).catch((err) => {
        console.error("❌ Error sending user auto-reply:", err);
      });

      // Response to frontend
      return res.status(201).json({
        success: true,
        message: "Message sent successfully!",
        data: {
          id: contact._id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET All Contacts
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
});

/*
|--------------------------------------------------------------------------
| Mark Contact as Read
|--------------------------------------------------------------------------
*/
router.patch("/:id/read", async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
});

export default router;