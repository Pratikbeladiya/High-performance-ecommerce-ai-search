const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword
    });

    await user.save();

    res.json({
        message: "Signup Successful"
    });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({
            message: "User Not Found"
        });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.json({
            message: "Wrong Password"
        });
    }

    res.json({
        message: "Login Successful"
    });
});

module.exports = router;