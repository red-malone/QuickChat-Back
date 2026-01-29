import express from "express";
import {
  getUsers,
  getMessages,
  markMessageAsSeen,
  sendMessage
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";
/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: Message management and retrieval
 */

const messageRouter = express.Router();

/**
 * @swagger
 * /message/users:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get all users except the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */

messageRouter.get("/users", protect, getUsers);

/**
 * @swagger
 * /message/messages/{userId}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get messages between authenticated user and another user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 */
messageRouter.get("/messages/:userId", protect, getMessages);

/**
 * @swagger
 * /message/messages/seen/{messageId}:
 *   put:
 *     tags:
 *       - Messages
 *     summary: Mark message as seen
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message marked as seen successfully
 */

messageRouter.put("/messages/seen/:messageId", protect, markMessageAsSeen);

/**
 * @swagger
 * /message/send/{id}:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Send a message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message sent successfully
 */
messageRouter.post("/send/:id", protect, sendMessage);
export default messageRouter;
