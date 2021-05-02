const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    if (req.body.password.length < 8) {
        return res.status(400).json({message : 'Too short password !'});
    }
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
        email: req.body.email,
        password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'User created !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  };

exports.login = (req, res, next) => {
User.findOne({ email: req.body.email })
    .then(user => {
    if (!user) {
        return res.status(401).json({ error: 'User not found !' });
    }
    bcrypt.compare(req.body.password, user.password)
        .then(valid => {
        if (!valid) {
            return res.status(401).json({ error: 'Incorrect password !' });
        }
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
            { userId: user._id },
            '*',
            { expiresIn: '24h' }
            )
        });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'User deleted !'}))
      .catch(error => res.status(400).json({ error }));
  };

