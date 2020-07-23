// require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
  },
  number: {
      type: String,
      validate: {
          validator: function(value) {
            const check = value.split("")
            let numDigits = 0
            for (let i = 0 ; i < check.length ; i++) {
                if (check[i] >= '0' && check[i] <= '9') {
                    numDigits++
                }
            }
            // console.log(numDigits)
            return numDigits >= 8
        },
        // message: props => `${props.value} is an invalid number`
      },
      require: true,
  }
//   important: Boolean,
})

// apply uniqueValidator plugin to personSchema
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)