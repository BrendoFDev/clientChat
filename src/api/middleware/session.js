exports.authenticateSession = (req,res,next) => {
    if(req.session && req.session.user){
        console.log("usuário autenticado")
        res.locals.user = req.session.user;
        return next();
    }
    else{
        console.log("usuário não autenticado")
        res.locals.user = null
        res.render('login');
        return;
    }
}
