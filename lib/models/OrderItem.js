// Тиждень 11: Модель OrderItem — pivot-колекція для зв'язку many-to-many
// Один рядок OrderItem = одна позиція у замовленні (drink × quantity).
// Драйнк може фігурувати в багатьох OrderItem (у різних замовленнях),
// а замовлення має багато OrderItem — звідси many-to-many.
//
// priceAtOrder зберігає ціну напою на момент замовлення (історичний snapshot),
// щоб зміна ціни в Drink не перераховувала вже створені замовлення.

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Замовлення обов'язкове"],
      index: true, // швидкий пошук позицій одного замовлення
    },
    drink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drink",
      required: [true, "Напій обов'язковий"],
      index: true, // швидкий пошук "у яких замовленнях був цей напій"
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Мінімум 1"],
      max: [20, "Максимум 20"],
    },
    priceAtOrder: {
      type: Number,
      required: true,
      min: [0, "Ціна не може бути від'ємною"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.OrderItem ||
  mongoose.model("OrderItem", orderItemSchema);
