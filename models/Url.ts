import { Document, Schema, model } from 'mongoose';

export interface IUrl extends Document {
  originalUrl: string;
  shortenUrlKey: string;
  createdAt: Date;
  expiresAt: Date;
}

const UrlSchema = new Schema<IUrl>({
  originalUrl: { type: String, required: true, unique: true },
  shortenUrlKey: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: () => new Date() },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) },
});

export default model<IUrl>('Url', UrlSchema);
