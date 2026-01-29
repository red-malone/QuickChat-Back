import express from "express";
import { signupUser, loginUser, updateUserProfile, checkAuth } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and authentication
 */
const userRouter=express.Router()
/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags:
 *       - Users
 *     summary: Signup a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
userRouter.post("/signup", signupUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login user and receive JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile (protected)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *               bio:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
userRouter.put("/profile", protect, updateUserProfile);

/**
 * @swagger
 * /users/check-auth:
 *   get:
 *     tags:
 *       - Users
 *     summary: Check if user is authenticated (protected)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 */
userRouter.get("/check-auth", protect, checkAuth);

// //Get user profile route
// userRouter.get("/profile",protect,getUserProfile);

export default userRouter;
