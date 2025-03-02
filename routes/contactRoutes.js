const express = require("express");
const contactController = require("../controllers/contactController");
const { validateContact } = require("../middleware/middleware");

const router = express.Router();

router.get("/", contactController.index);

router.get("/tambah", contactController.create);
router.post("/", contactController.store);

router.get("/edit/:id", contactController.edit);
router.put("/:id", contactController.update);

router.get("/:id", contactController.show);

router.delete("/:id", contactController.destroy);

module.exports = router;
