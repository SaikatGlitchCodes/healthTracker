const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const prisma = require('../../../util/primaInit');

passport.use(new GitHubStrategy({
    clientID: 'Ov23livPoCnhAh6HYfAm',
    clientSecret: '3ba3185a647cda593c33a661207166b897e4abfb',
    callbackURL: "http://localhost:4000/auth/github/callback",
    scope: ["user:email"],
  },
  async function(accessToken, refreshToken, profile, done) {
    try{
    const response = await prisma.user.upsert({
        where:{email: profile?.emails[0]?.value},
        update:{},
        create:{
            name: profile.username,
            profile_img: profile.photos[0]?.value,
            email: profile?.emails[0]?.value,
            age: 20,
            hashedPassword: 'randomText'
        }
    });
        return done(null, response);
    }catch(err){
        return done(err, null);
    }
    return done(null, profile);
  }
));

