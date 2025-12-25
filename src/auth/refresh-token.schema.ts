import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class RefreshToken extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  tokenHash: string;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ required: true })
  expiresAt: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshToken);
