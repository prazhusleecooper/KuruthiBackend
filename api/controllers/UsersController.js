/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var jwt = require('jsonwebtoken');

module.exports = {
  //Sign-up - create user
  /*
  * Codes:
  *  -2: User entered email already exists          --406
  *  -1: User entered phone number already exists   --406
  *   0: Error creating user/ Signing-up            --500
  *   1: Sign-up successful                         --200
  * */
  signup: async (req, res) => {
    let usersList = await Users.find().sort('uid DESC');
    let userEmailExists = false;
    let userPhoneNumberExists = false;
    let uid = 0;
    if(usersList.length <= 0) {
      userEmailExists = false;
      userPhoneNumberExists = false;
      uid = 1;
    } else if(usersList.length === 1) {
      if(usersList[0].email === req.body.email) {
        userEmailExists = true;
      }
      if(usersList[0].phoneNumber === req.body.phoneNumber) {
        userPhoneNumberExists = true
      }
      uid = usersList[0].uid + 1;
    } else if(usersList.length > 1) {
      usersList.map(user => {
        if(user.email === req.body.email) {
          userEmailExists = true;
        }
        if(user.phoneNumber === req.body.phoneNumber) {
          userPhoneNumberExists = true;
        }
      });
      uid = usersList[0].uid + 1;
    }
    if(userEmailExists) {
      return res.status(406)
                .send({
                  status: 406,
                  code: -2,
                });
    } else if(userPhoneNumberExists) {
      return res.status(406)
                .send({
                  status: 406,
                  code: -1
                });
    } else if(!userPhoneNumberExists && !userEmailExists) {
      try {
        await Users.create({
          uid: uid,
          email: req.body.email,
          password: req.body.password,
          userName: req.body.userName,
          age: req.body.age,
          bloodGroup: req.body.bloodGroup,
          phoneNumber: req.body.phoneNumber,
        });
        return res.ok({
          status: 200,
          code: 1,
        });
      } catch (error) {
        return res.serverError({
          status: 500,
          code: 0
        })
      }
    }
  },

  //Login
  /*
  * Codes:
  *  -2: User entered email does not exist
  *  -1: User entered email and password pair is not vaid
  *   0: Error logging-in
  *   1: Login successful
  * */
  login: async (req, res) => {
    let usersList = await Users.find().decrypt();
    let user = {};
    usersList.map(userRecord => {
      if(userRecord.email === req.body.email) {
       user = userRecord;
      }
    });
    console.log('USER::::', user);
    sails.log('USER::', user);
    if(!user || user === {}) {
      return res.status(406)
                .send({
                  status: 406,
                  code: -2
                });
    } else if(user || user !== undefined || user !== {}) {
      if(user.password === req.body.password) {
        let jwtPayload = {
          email: user.email,
          uid: user.uid,
          provider: 'K0'
        };
        let jwtToken = await jwt.sign(jwtPayload, sails.config.session.secret, { expiresIn: '1h' });
        return res.ok({
          status: 200,
          token: jwtToken,
          code: 1
        });
      } else {
        return res.status(406)
                  .send({
                    status: 406,
                    code: -1
                  });
      }
    } else {
      return res.serverError({
        status: 500,
        code: 0
      });
    }
  },
};

