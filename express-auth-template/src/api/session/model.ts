import { getModelForClass, prop, Ref } from "@typegoose/typegoose";

export class Session {}

const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});

export default SessionModel;
