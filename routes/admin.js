const express = require('express');
const router = express.Router();
const { writeContacts } = require('../db/helpers');
const contacts = require('../lib/db_seed.json');

const basePath = '/admin';

/* GET contacts list */
/**
 * @swagger
 * /api/admin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Reset the DB to the original values
 *     description: Returns the full contacts list as it was originally defined
 *     responses:
 *       '200':
 *         description: Returns an array of contacts in "data"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               statusCode: 200,
 *               message: 'Successfully reset the db'
 *               data: {}
 */
router.post(basePath, (req, res) => {
  writeContacts(contacts);
  return res.status(200).json({
    statusCode: 200,
    message: 'Successfully reset the db',
    data: {},
  });
});

module.exports = router;