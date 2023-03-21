const { Contact } = require("../db/contactModel");

const getAllContacts = async (owner, query) => {
  const { page, limit, favorite } = query;
  const skipped = (page - 1) * limit;
  const skip = skipped < 0 ? 0 : skipped;
  const limited = limit < 10 ? limit : 10;
  if (favorite !== undefined) {
    return await Contact.find({ favorite: { $eq: favorite }, owner })
      .select({
        __v: 0,
      })
      .skip(skip)
      .limit(limited);
  }

  const contacts = await Contact.find({ owner })
    .select({ __v: 0 })
    .skip(skip)
    .limit(limited);
  return contacts;
};

const getContactId = async (contactId, owner) => {
  const contact = await Contact.findOne({
    _id: contactId,
    owner,
  });
  return contact;
};

const addContact = async (newContact, owner) => {
  const { name, email, phone, favorite = false } = newContact;
  await Contact.create({
    name,
    email,
    phone,
    favorite,
    owner,
  });
};

const deleteContact = async (contactId, owner) => {
  const data = await await Contact.deleteOne({
    _id: contactId,
    owner,
  });
  return data;
};

const updateContact = async (contact, contactId, owner) => {
  const data = await await Contact.updateOne(
    {
      _id: contactId,
      owner,
    },
    {
      $set: contact,
    }
  );
  return data;
};

const updateStatusContact = async (favorite, id, owner) => {
  const data = await await Contact.updateOne(
    {
      _id: id,
      owner,
    },
    { $set: { favorite } }
  );
  return data;
};
module.exports = {
  addContact,
  getAllContacts,
  getContactId,
  deleteContact,
  updateContact,
  updateStatusContact,
};
