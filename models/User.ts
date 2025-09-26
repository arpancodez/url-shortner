import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export default model<IUser>('User', UserSchema);
