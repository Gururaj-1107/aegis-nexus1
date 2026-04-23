const express = require('express');
const router = express.Router();
const verifyGoogleToken = require('../middleware/auth');

/**
 * Frontend calls this right after receiving Google credential
 * to exchange and verify, confirming the auth chain is locked.
 */
router.post('/verify', verifyGoogleToken, (req, res) => {
  // If middleware passes, the JWT is legit and user is attached
  res.json({
    status: 'success',
    user: req.user
  });
});

module.exports = router;
