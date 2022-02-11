const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express')
const router = express.Router();
const mongoose = require("mongoose");

const mserSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = new mongoose.model("User", mserSchema)
// router.get("/Register", (req, res) => {
//     res.send("your in signup")
//   });
// router.post("/Register",(req,res)=>{
//     console.log(req.body) 
//     const {email,password} =req.body;
//     // const salt = bcrypt.genSalt(10);
//     // User.password =  bcrypt.hash(password, salt);
//     User.findOne({email:email},(err,user)=>{
//         if(user){
//             res.send({message:"user already exist"})
//         }else {
//             const user = new User({email,password})
//             user.save(err=>{
//                 if(err){
//                     res.send(err)
//                 }else{
//                     res.send({message:"sucessfull"})
//                 }
//             })
//         }
//     })

//     var hashedPassword = password;



//     // Encryption of the string password
// //     bcrypt.genSalt(10, function (err, Salt) {

// //         // The bcrypt is used for encrypting password.
// //         bcrypt.hash(password, Salt, function (err, hash) {

// //             if (err) {
// //                 return console.log('Cannot encrypt');
// //             }

// //             hashedPassword = hash;
// //             console.log(hash);

// //           bcrypt.compare(password, hashedPassword,
// //                 async function (err, isMatch) {


// //                 if (isMatch) {
// //                     console.log('Encrypted password is: ', password);
// //                     console.log('Decrypted password is: ', hashedPassword);
// //                 }

// //                 if (!isMatch) {

// //                     console.log(hashedPassword + ' is not encryption of '
// //                     + password);
// //                 }
// //             })

// //         })
// //     })
// //    User.password = hashedPassword;


//    const payload = {
//     user: {
//         id: User.id
//     }
// };
// jwt.sign(
//     payload,
//     "randomString", {
//         expiresIn: 10000
//     },
//     (err, token) => {
//         if (err) throw err;
//         res.status(200).json({
//             token
//         });
//     }
// );
// }) 

router.post("/Register", async (req, res) => {
    const payload = {
        user: {
            id: User.id
        }
    };
    jwt.sign(
        payload,
        "randomString", {
        expiresIn: 10000
    },
        (err, token) => {
            if (err) throw err;
            return res.status(200).json({
                token
            }
            );
        }

    );
    const body = req.body;

    if (!(body.email && body.password)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }

    // creating a new mongoose doc from user data
    const user = new User(body);
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.status(201).send(doc)
    );





});

router.get("/Login", (req, res) => {
    res.send("your in LOGIN")
});


router.post("/Login", (req, res) => {
    // jwt.sign(
    //     payload,
    //     "randomString", {
    //         expiresIn: 10000
    //     },
    //     (err, token) => {
    //         if (err) throw err;
    //         res.status(200).json({
    //             token
    //         });
    //     }
    // );
    const { email, password } = req.body;
    User.findOne({ email: email }, async (err, user) => {
        // bcrypt.compare(req.body.password != user.password,function(err,res){
        //     if(req.body.password != user.password){
        //         res.json({success: false, message: 'passwords do not match'});
        //       } else {
        //         // Send JWT
        //       }
        // })
        if (user) {
            // console.log(bcrypt.compare(user.password))
            if (password === user.password) {
              
                
                const payload = {
                    user: {
                        id: user.id
                    }
                };
                jwt.sign(
                    payload,
                    "randomString", {
                    expiresIn: 10000
                },
            
                    (err, token) => {
                        if (err) throw err;
                        return res.status(200).json({
                            message: "login sucess", user: user ,token: token
                          
                        });
                    }
                    
                );
            //     res.send({ 
            //  })
            } else {
                res.send({ message: "wrong credentials" })
            }
        } else {
            res.send("not register")
        }
    })
    // const payload = {
    //     user: {
    //         id: User.id
    //     }
    // };
    // jwt.sign(
    //     payload,
    //     "randomString", {
    //         expiresIn: 10000
    //     },
    //     (err, token) => {
    //         if (err) throw err;
    //        return res.status(200).json({
    //             token
    //         });
    //     }
    // );

})

module.exports = router;