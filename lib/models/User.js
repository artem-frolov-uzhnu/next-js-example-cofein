// Тиждень 8: Модель користувача для аутентифікації

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ім'я обов'язкове"],
      trim: true,
      minlength: [2, "Мінімум 2 символи"],
    },
    email: {
      type: String,
      required: [true, "Email обов'язковий"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w.-]+@[\w.-]+\.\w+$/, "Некоректний формат email"],
    },
    password: {
      type: String,
      required: [true, "Пароль обов'язковий"],
      minlength: [6, "Мінімум 6 символів"],
      select: false, // Не повертати пароль за замовчуванням
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
