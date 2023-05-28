const User = require("../model/user");
var checkUser = async (req, res, next) => {
    const { email } = req.params;
    User.findOne({ where: { email: email } })
      .then((result) => {
        // res.status(200).json(result);
        if(!result){
            res.json("you can go ahead")
            next();
        }else{ 
            res.json({status:409,message:"user already exists"})
        }
      })
      .catch((err) => {
        res.status(500).json({ error: 'something went wrong' });
      });
}