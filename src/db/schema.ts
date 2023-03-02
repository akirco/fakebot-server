import { mg } from '.'

const userSchema = new mg.Schema({
  name: String,
  email: String,
  age: Number,
  pwd: String,
})

const User = mg.model('User', userSchema)

export { User }
