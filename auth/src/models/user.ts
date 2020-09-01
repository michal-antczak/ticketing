import mongoose from "mongoose";
import { Password } from "../services/password";

//defining TS interface to gain the control over what properities should be passed when creating a new user
interface UserAttributes {
    email: string;
    password: string;
}
// interface responsible to letting mongose know about extra build method on our schema
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttributes): UserDoc;
}
// interface describing document created while new User is being called (so user in syntax const user = User.build)
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    createdAt: string;
}

const { Schema } = mongoose;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// running mongo db middleware every time password is modified
userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hash = await Password.toHash(this.get("password"));
        this.set("password", hash);
    }
    done();
});

// adding new method to the schema via static properity
userSchema.statics.build = (attrs: UserAttributes) => {
    return new User(attrs);
};
// angle brackets are generic arguments of function
// mongoose.model returns a type of mongoose.model by default this model doesn't know about adjusted functionality 'build'
// that's why we need to inform TS that this functionality is added by refering to UserModel(as second arg)
// which extends mongoose.model with build functionality as described above
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };