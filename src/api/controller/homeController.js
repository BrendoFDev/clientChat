exports.getLogin = (req,res)=>{
   try {
        res.render('login');
   } catch (error) {
        res.status(400).render('error', {status:400, message:'erro ocorreu'});
   }
};

exports.getIndex = (req,res)=>{
    try{
        res.render('index');
    }
    catch(error){
        res.status(400).render('error', {status:400, message:'erro ocorreu'});
    }
};

exports.getCadUser = (req,res)=>{
    try{
        res.render('caduser');
    }
    catch(error){
        res.status(400).render('error', {status:400, message:'erro ocorreu'});
    }
};
