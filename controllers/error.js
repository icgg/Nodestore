exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404', isAuthenticated: req.session.user});
};

exports.get505 = (req, res, next) => {
  res.status(500).render('500', { pageTitle: 'Error found!', path: '/500', isAuthenticated: req.session.user});
};
