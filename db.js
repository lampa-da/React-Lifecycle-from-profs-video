const Sequelize = require('sequelize')
const {STRING, TEXT} = Sequelize
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_react_db')
const faker = require('faker')

const User = conn.define('user', {
  name: STRING,
  bio: TEXT  
}, {
  hooks: {
    beforeCreate: function(user){
      if(!user.bio){
        user.bio =`${user.name}. ${faker.lorem.paragraphs(3)}. ${user.name}`
      }
      console.log(user)
    }
  }
})

User.createWithName = (name) => User.create({name})

const synAndSeed = async()=>{
  await conn.sync({force: true})
  const [moe, lucy, curly] = await Promise.all(
    ['moe', 'lucy', 'curly'].map(User.createWithName)
  )
  console.log(lucy.get())
}

module.exports = {
  models:{
    User
  },
  synAndSeed  
}
