import { UUID } from 'crypto';
import { Schema, Document, model, models } from 'mongoose';

export interface IMetadata extends Document {
  userId: string;
  profile: IProfile;
}

export interface IProfile {
  id: UUID;
  username: string;
  email?: string;
  picture: string;
  apiKey: string;
  phoneNumber: string | null;
  biography?: string | null;
}

const userSchema = new Schema<IProfile>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: false },
  picture: { type: String, required: true },
  apiKey: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: false },
  biography: { type: String, required: false },
});

export const UserModel = models.User || model<IMetadata>('User', userSchema);
