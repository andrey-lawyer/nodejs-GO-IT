const {
  addContact,
  getAllContacts,
  getContactId,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../services/contactService");

const addContactController = async (req, res) => {
  const newContact = req.body;
  const { _id: owner } = req.user;

  const contact = await addContact(newContact, owner);
  res.status(201).json(contact);
};

const getContactsController = async (req, res) => {
  const { _id: owner } = req.user;
  const query = req.query;
  const contacts = await getAllContacts(owner, query);
  res.status(200).json(contacts);
};

const getContactIdController = async (req, res) => {
  const id = req.params.contactId;
  const { _id: owner } = req.user;

  const data = await getContactId(id, owner);
  if (!data) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(200).json(data);
};

const deleteContactController = async (req, res) => {
  const id = req.params.contactId;
  const { _id: owner } = req.user;
  const data = await deleteContact(id, owner);
  if (data.deletedCount === 0) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(200).json({ massage: `contact with id ${id} was removed` });
};

const updateContactController = async (req, res) => {
  const contact = req.body;
  const { _id: owner } = req.user;
  const id = req.params.contactId;
  const { name, email, phone } = contact;
  if (!name && !email && !phone) {
    return res.status(400).json({ error: "missing fields" });
  }
  const { data, newUpdateContact } = await updateContact(contact, id, owner);
  if (data.matchedCount === 0) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(200).json(newUpdateContact);
};

const patchFavoriteController = async (req, res) => {
  const id = req.params.contactId;
  const { _id: owner } = req.user;
  const { favorite } = req.body;
  if (favorite === undefined) {
    return res.status(400).json({ error: "missing fields favorite" });
  }
  const data = await updateStatusContact(favorite, id, owner);
  if (data.matchedCount === 0) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(200).json({ status: "success" });
};

module.exports = {
  getContactsController,
  addContactController,
  getContactIdController,
  deleteContactController,
  updateContactController,
  patchFavoriteController,
};
