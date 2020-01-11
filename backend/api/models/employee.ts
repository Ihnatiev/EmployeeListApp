import mongoose, { Schema, Document } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment'

export interface IEmployee extends Document {
    //empID: number;
    empName: string;
    empActive: boolean;
    empDepartment: string;
    creator: string;
}

const EmployeeSchema: Schema = new Schema({
    //empID: { type: Number },
    empName: { type: String, required: true },
    empActive: { type: Boolean, required: true },
    empDepartment: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// EmployeeSchema.plugin(autoIncrement.plugin, {
//     model: 'Employee',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
