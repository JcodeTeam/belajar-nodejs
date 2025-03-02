const express = require("express");
const contactController = require("../controllers/contactController");
const Middleware = require("../middleware/middleware");

const router = express.Router();

router.get("/", contactController.index);

router.get("/tambah", contactController.create);
router.post("/", Middleware.validateContact, contactController.store);

router.get("/edit/:id", contactController.edit);
router.put("/:id", Middleware.validateUpdate, contactController.update);

router.get("/:id", contactController.show);

router.delete("/:id", contactController.destroy);

module.exports = router;
