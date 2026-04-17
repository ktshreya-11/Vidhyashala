const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); // Your User model

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// --- Google Strategy Setup ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Check if user already exists in our MongoDB
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // If not, create a new user (default to 'student' role for now)
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        role: 'student' 
      });
    }
    return done(null, user);
  }
));

// --- Routes ---
app.use('/auth', require('./routes/auth'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

app.listen(5000, () => console.log("🚀 Backend on http://localhost:5000"));
