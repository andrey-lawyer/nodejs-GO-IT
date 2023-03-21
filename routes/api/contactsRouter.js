const express = require("express");
const router = express.Router();

const {
  addContactValidation,
  updateContactValidation,
  patchFavoriteValidation,
} = require("../../middlewars/validationMiddlewareContacts");

const { asyncWrapper } = require("../../helpers/apiHelper");

const {
  addContactController,
  getContactsController,
  getContactIdController,
  deleteContactController,
  updateContactController,
  patchFavoriteController,
} = require("../../controllers/contactController");
const { authMiddleware } = require("../../middlewars/authMiddleware");

router.use(authMiddleware);

router.get("/", asyncWrapper(getContactsController));
router.post("/", addContactValidation, asyncWrapper(addContactController));
router.get("/:contactId", asyncWrapper(getContactIdController));
router.delete("/:contactId", asyncWrapper(deleteContactController));

router.put(
  "/:contactId",
  updateContactValidation,
  asyncWrapper(updateContactController)
);

router.patch(
  "/:contactId/favorite",
  patchFavoriteValidation,
  asyncWrapper(patchFavoriteController)
);

// module.exports = router;
module.exports = { contactsRouter: router };
