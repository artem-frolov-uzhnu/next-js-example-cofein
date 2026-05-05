// Тиждень 11: Mongoose модель Order
// Зв'язки:
//   - user → User: 1-to-many (один користувач має багато замовлень)
//   - items ↔ drinks: many-to-many через окрему колекцію OrderItem
//
// Позиції (drink + quantity + priceAtOrder) живуть у моделі OrderItem.
// Тут — лише верхній рівень замовлення: хто, статус, сума, коментар.

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Користувач обов'язковий"],
      index: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Сума не може бути від'ємною"],
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    notes: {
      type: String,
      maxlength: [300, "Коментар до 300 символів"],
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Складений індекс: "останні замовлення користувача"
orderSchema.index({ user: 1, createdAt: -1 });

// Virtual populate: Order.items — зворотна сторона зв'язку OrderItem.order
// Дозволяє робити Order.findById(id).populate({ path: "items", populate: "drink" })
orderSchema.virtual("items", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "order",
});

// Cascade: при видаленні замовлення прибираємо всі його позиції.
// Спрацьовує для Order.findByIdAndDelete() / Order.findOneAndDelete().
orderSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await mongoose.model("OrderItem").deleteMany({ order: doc._id });
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
