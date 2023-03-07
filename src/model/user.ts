import { prop, getModelForClass } from '@typegoose/typegoose'

export class User {
  @prop({ required: true })
  username!: string

  @prop({ required: true })
  password!: string

  @prop({ required: false, unique: true })
  email?: string

  @prop({ required: false })
  token?: string

  @prop({ required: false })
  token_expires_at: Date

  @prop({ required: true })
  created_at: Date
}

const UserModel = getModelForClass(User)

export default UserModel
