module.exports = (req, res, next) => { //authentication middelware 

    if(!req.session.isLoggedIn)
        return res.redirect('/login');

    next();
}