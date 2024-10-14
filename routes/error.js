const express = require("express");
const { getServerError } = require("../controllers/error");

const router = express.Router();

router.get("/500", getServerError);

module.exports = router;
