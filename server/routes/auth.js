const router = require('express').Router();
const passport = require('passport');

// This starts the Google Login process
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// This handles the response from Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // On success, redirect back to your React app
    res.redirect('http://localhost:3000'); 
  }
);

module.exports = router;
