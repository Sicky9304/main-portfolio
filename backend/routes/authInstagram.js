import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/instagram/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Authorization code is missing.",
    });
  }

  try {
    const APP_ID = process.env.INSTAGRAM_APP_ID;
    const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
    const REDIRECT_URI =
      "https://main-portfolio-24pg.onrender.com/auth/instagram/callback";

    // Exchange authorization code for short-lived token
    const { data: shortTokenData } = await axios.get(
      "https://graph.facebook.com/v20.0/oauth/access_token",
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
        },
      }
    );

    // Exchange short-lived token for long-lived token
    const { data: longTokenData } = await axios.get(
      "https://graph.facebook.com/v20.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: APP_ID,
          client_secret: APP_SECRET,
          fb_exchange_token: shortTokenData.access_token,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Long-lived access token generated successfully.",
      accessToken: longTokenData.access_token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        err.response?.data?.error?.message ||
        "Failed to generate access token.",
    });
  }
});

router.all("/instagram/deauthorize", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Deauthorized successfully."
  });
});

export default router;