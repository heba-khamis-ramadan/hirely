import { Schema, Types, model } from "mongoose";

// schema
const chatSchema = new Schema({ 
    senderId: {type: Types.ObjectId, ref: "User", required: true},
    receiverId: {type: Types.ObjectId, ref: "User", required: true},
    messages: { type: [{message: {type: String},
                        senderId: {type: Types.ObjectId, ref: "User", required: true}}]
                    },
}, {
    timestamps: true
});

// model
export const Chat = model("Chat", chatSchema);