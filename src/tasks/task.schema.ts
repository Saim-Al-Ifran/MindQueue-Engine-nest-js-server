import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskPriority, TaskStatus } from '../common/enums';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop()
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedToId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdById: Types.ObjectId;

  @Prop({ type: Types.ObjectId, default: null })
  projectId: Types.ObjectId | null;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
