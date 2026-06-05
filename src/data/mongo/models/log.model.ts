import moongoose from "mongoose";

// level: LogSeverityLevel;
// message: string;
// origin: string;
// createdAt?: Date;

const logSchema = new moongoose.Schema({
  level: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const LogModel = moongoose.model("Log", logSchema);
