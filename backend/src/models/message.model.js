import {Schema , model} from "mognoose"

const messageSchema = new Schema({
   sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
   },
   content: {
    type: String,
    required: true,
    trim: true
   },
   chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat"
   }
},{timestamps: true})

export const Message = model("Message", messageSchema) 