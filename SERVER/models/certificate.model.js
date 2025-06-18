import mongoose, { Schema, model } from "mongoose";

const CertificateSchema = new Schema({
    userId:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId:
    {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true

    },
    certificateUrl:
    {
        type: String,
        required: true

    },
    issuedAt:
    {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

export const Certificate = mongoose.model("Certificate", CertificateSchema);