
exports.authenticateSession = (req, res, next) => {
   socket.on('disconnect', ()=>{
        res.render('login');
        next();
   });
};
