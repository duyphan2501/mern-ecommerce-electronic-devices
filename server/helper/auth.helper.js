import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { generateAccessTokenAndSetCookie, generateRefreshTokenAndSetCookie } from "./jwt_service.js";
import { mergeCart } from "../service/cart.service.js";
dotenv.config({quiet: true});

const clientId = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(clientId);

const verifyToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });

  const payload = ticket.getPayload();

  return payload;
};

const handlePostLogin = async(req, res, user) => {
// generate token and set cookie
    const accessToken = await generateAccessTokenAndSetCookie(res, {
      userId: user._id,
      email: user.email,
    });
    const refreshToken = await generateRefreshTokenAndSetCookie(res, {
      userId: user._id,
      email: user.email,
    });

    // save token in db
    user.refreshToken = refreshToken;
    const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokenExpireAt = expireDate;
    user.lastLogin = Date.now();
    await user.save();

    // merge to use cart
    const guestCartId = req.cookies.cartId;
    await mergeCart(guestCartId, user._id);

    return accessToken;
}

export { verifyToken, handlePostLogin };
