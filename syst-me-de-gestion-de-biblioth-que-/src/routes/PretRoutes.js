const express = require("express");
const {
  createPret,
  returnPret,
  extendPret,
  getUserPrets,
  getOverduePrets
} = require("../controllers/pretController");

const { auth, authorize } = require("../middleware/auth");
const { validateLoan } = require("../middleware/validation");

const router = express.Router();

router.post("/", auth, authorize("employe"), validateLoan, createPret);

router.put("/:id/return", auth, authorize("employe"), returnPret);

router.put("/:id/extend", auth, authorize("employe"), extendPret);

router.get("/user/:userId?", auth, getUserPrets);

router.get("/overdue", auth, authorize("employe"), getOverduePrets);

module.exports = router;