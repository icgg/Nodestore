const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto'); //to create secure random values
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: 'send_grid_key'
  }
})); //specifies a configuration for sending emails

exports.getLogin = (req, res, next) => {
  
    let message = req.flash('error'); //req.flash('key') returns an array of messages
    if (message.length > 0)
      message = message[0];
    else 
      message = null;

      res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
          email: '',
          password: ''
        },
        validationErrors: []
      });

}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};



exports.getSignup = (req, res, next) => {

  let message = req.flash('error'); //req.flash('key') returns an array of messages
  if (message.length > 0)
    message = message[0];
  else 
    message = null;

    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      validationErrors: []
    });
  };

exports.postLogout = (req, res, next) => {

  req.session.destroy((err) => { //ends current session and deletes saved session data
    console.log(err);
    res.redirect('/');
  }); 

}

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });


  User.findOne({email: email})
  .then(result => {
    if(result){
      req.flash('error', 'E-mail exists already, please choose a different one');
      return res.redirect('/signup');
    }

    return bcrypt.hash(password, 12)
    .then(hashedPassword => {
    const newUser = new User({
    email: email,
    password: hashedPassword,
    cart: {items: []}
    })
    console.log('user created');
    return newUser.save()
  })
})
  .then(result => {
    res.redirect('/login');
    return transporter.sendMail({
      to: email,
      from: 'shop@node-complete.com',
      subject: 'Signup succeeded!',
      html: '<h1>You successfully signed up!</h1>'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {

  let message = req.flash('error'); //req.flash('key') returns an array of messages
  if (message.length > 0)
    message = message[0];
  else 
    message = null;

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    isAuthenticated: false,
    errorMessage: message
})
}

exports.postReset = (req, res, next) => {

  crypto.randomBytes(32, (err, buffer) => {

    if(err){
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex'); //hex converts hexidecimal values to ASCII
    User.findOne({email: req.body.email})
    .then(user =>{
      if(!user){
        req.flash('error', 'No account with that email exists');
        res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExp = Date.now() + 3600000;
      return user.save();
    })
    .then(result => {

      res.redirect('/');
      return transporter.sendMail({
      to: req.body.email,
      from: 'shop@node-complete.com',
      subject: 'Password reset',
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
      `
    });

    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  })

}

exports.getResetForm = (req, res, next) => {

  const token = req.params.token;

  User.findOne({resetToken: token, resetTokenExp: { $gt: Date.now() } })
  .then(user => {

    if(!user){
      req.flash('error', 'That link has expired');
      res.redirect('/login');
    }
      

    let message = req.flash('error'); //req.flash('key') returns an array of messages
    if (message.length > 0)
      message = message[0];
    else 
      message = null;
  
    res.render('auth/resetform', {
      path: '/reset',
      pageTitle: 'Reset Password',
      isAuthenticated: false,
      errorMessage: message,
      userId: user._id.toString(),
      token: token
  })

  })

}

exports.postResetForm = (req, res, next) => {

  const token = req.body.token;
  const userId = req.body.userId;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if(password !== confirmPassword){
    req.flash('error', 'Passwords do not match');
    res.redirect('/reset/' + token);
  }

  User.findOne({resetToken: token, resetTokenExp: { $gt: Date.now() }, _id: userId})
  .then(user => {
    return bcrypt.hash(password, 12)
    .then(hashedPassword => {
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExp = undefined;
    console.log('user password updated');
    return user.save()
  })
  .then(result => {
    res.redirect('/login');
  })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

}