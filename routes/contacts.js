const express = require('express');
const router = express.Router();
const { getContacts, writeContacts } = require('../db/helpers');

const basePath = '/contacts';

/* GET contacts list */
/**
 * @swagger
 * /api/contacts:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Get contacts
 *     description: Returns the full contacts list
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
 *               message: 'Successfully retrieved the contacts list'
 *               data: [
 *                 { id: 1, first_name: 'Anakin', last_name: 'Skywalker', job: 'Jedi Knight', description: 'The Chosen one' },
 *                 { id: 2, first_name: 'Boba', last_name: 'Fett', job: 'Bounty Hunter', description: 'Son of Jango Fett' },
 *               ]
 */
router.get(basePath, (req, res) => {
  return res.status(200).json({
    statusCode: 200,
    message: 'Successfully retrieved the contacts list',
    data: getContacts(),
  });
});

/* GET single contact */
/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Get single contact
 *     description: Get a contact by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: the data field contains the contact information
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
 *               message: 'Contact successfully retrieved'
 *               data: { id: 1, first_name: 'Anakin', last_name: 'Skywalker', job: 'Jedi Knight', description: 'The Chosen one' }
 *       '404':
 *         description: Contact not found
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
 *               statusCode: 404,
 *               message: 'Contact not found'
 *               data: {}          
 */
router.get(`${basePath}/:id`, (req, res) => {
  const { id } = req.params;
  const contact = getContacts().find((contact) => contact.id == id);
  if (!contact) {
    return res.status(404).json({ statusCode: 404, message: 'Contact not found', data: {}});
  }

  return res.status(200).json({ statusCode: 200, message: 'Contact successfully retrieved', data: contact });
});

/* POST create contact */
/**
 * @swagger
 * /api/contacts:
 *   post:
 *     tags:
 *       - Contacts
 *     description: Add a concat to the DB by providing first_name, last_name, job and description
 *     summary: Create new contact
 *     requestBody:
 *       description: The request body requires a property "contact", which is nothing but an object containing the new contact's info
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               job:
 *                 type: string
 *               description:
 *                 type: string              
 *           example: { contact: { first_name: 'Anakin', last_name: 'Skywalker', job: 'Jedi Knight', description: 'The Chosen one' } }
 *     responses:
 *       '201':
 *         description: Returns the newly added contact in the data field
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
 *               statusCode: 201,
 *               message: 'Contact successfully added'
 *               data: { id: 1, first_name: 'Anakin', last_name: 'Skywalker', job: 'Jedi Knight', description: 'The Chosen one' }
 */
router.post(basePath, (req, res) => {
  const { contact } = req.body;
  const contacts = getContacts();

  const newContact = {
    id: contacts.length + 1,
    first_name: contact.first_name,
    last_name: contact.last_name,
    job: contact.job,
    description: contact.description,
  };
  contacts.push(newContact);

  writeContacts(contacts);

  return res.status(201).json({ statusCode: 201, message: 'Contact successfully added', data: newContact });

});

/* PATCH update contact */
/**
 * @swagger
 * /api/contacts/{id}:
 *   patch:
 *     tags:
 *       - Contacts
 *     summary: Update a contact
 *     description: Update a contact's information in the DB
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       description: Not all the fields are necessary.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               job:
 *                 type: string
 *               description:
 *                 type: string              
 *           example: { info: { first_name: 'Anakin' } }
 *     responses:
 *       '201':
 *         description: Updates the contact in the DB and returns it in the data field of the response
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
 *               statusCode: 201,
 *               message: 'Contact correctly updated'
 *               data: { id: 1, first_name: 'Anakin', last_name: 'Skywalker', job: 'Jedi Knight', description: 'The Chose one' }
*       '404':
 *         description: Contact not found
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
 *               statusCode: 404,
 *               message: 'Contact not found'
 *               data: {}   
 */
router.patch(`${basePath}/:id`, (req, res) => {
  const { id } = req.params;
  const { info } = req.body;

  const contacts = getContacts();

  // this step is not necessary for the update but it's handy to check whether the contact exists first or not.
  const elem = contacts.find((contact) => contact.id == id);

  if (!elem) {
    return res.status(404).json({ statusCode: 404, message: 'Contact not found', data: {} });
  }

  const updatedContact = { ...elem, ...info };

  writeContacts(contacts.map((contact) => contact.id === updatedContact.id ? updatedContact : contact))

  return res.status(201).json({ statusCode: 201, message: 'Contact correctly updated', data: updatedContact });
});

/* DELETE delete contact */
/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     tags:
 *       - Contacts
 *     summary: Delete contact
 *     description: Delete a contact by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Returns the delete contact in the field "data"
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
 *               message: 'Contact successfully retrieved'
 *               data: { id: 1, first_name: 'Anakin', last_name: 'Skywalker', job: 'Jedi Knight', description: 'The Chosen one' }
 *       '404':
 *         description: Contact not found
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
 *               statusCode: 404,
 *               message: 'Contact not found'
 *               data: {}          
 */
router.delete(`${basePath}/:id`, (req, res) => {
  const { id } = req.params;

  const contacts = getContacts();

  // this step is not necessary for the update but it's handy to check whether the contact exists first or not.
  const elem = contacts.find((contact) => contact.id == id);

  if (!elem) {
    return res.status(404).json({ statusCode: 404, message: 'Contact not found', data: {} });
  }

  const newContacts = contacts.filter((contact) => contact.id != id);
  
  writeContacts( newContacts);

  return res.status(200).json({ statusCode: 200, message: 'Contact correctly deleted', data: elem });
});

module.exports = router;
