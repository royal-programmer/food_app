const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");
router.get("/count", async (_0x1770dd, _0xf3b9ae) => {
  try {
    const _0x43eb26 = await Restaurant.countDocuments();
    _0xf3b9ae.json({
      count: _0x43eb26
    });
  } catch (_0x48a0d5) {
    _0xf3b9ae.status(0x1f4).json({
      error: "Unable to fetch the number of restaurants."
    });
  }
});
module.exports = router;