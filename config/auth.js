module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  },
  teacherAuth: function(req,res,next) {
    if(req.user) {
      if(req.user.permission == "teacher") {
        next()
      } else if(req.user.permission == "admin") {
        res.redirect('/dashboard')
      } else {
        res.redirect('/auth/logout')
      }
    } else {
      res.redirect('/auth/login')
    }
  }
};