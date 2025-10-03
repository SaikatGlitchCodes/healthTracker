const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy
const prisma = require('../../../../util/primaInit');
const bcrypt = require('bcrypt');

module.exports = passport.use(new LocalStrategy(async (username, password, done) => {
    console.log('LocalStrategy',username, password)
    try {
        const response = await prisma.user.findFirstOrThrow({
            where: {
                name: username
            }
        });
        if(bcrypt.compareSync(password, response.hashedPassword)){
            return done(null, response)
        }
        return done(null, false)
    }catch(err){
        return done(err, false)
    }
}));
