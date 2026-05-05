// Тиждень 7: Mongoose модель для напоїв кав'ярні «Кофеїн»
// Замінює in-memory масив з lib/drinks.js
// Тиждень 11: cascade pre-hook адаптований під many-to-many через OrderItem

import mongoose from "mongoose";

const drinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Назва напою обов'язкова"],
      trim: true,
      maxlength: [100, "Назва не може бути довшою за 100 символів"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Ціна обов'язкова"],
      min: [0, "Ціна не може бути від'ємною"],
    },
    emoji: {
      type: String,
      default: "☕",
    },
    category: {
      type: String,
      required: [true, "Категорія обов'язкова"],
      enum: {
        values: ["Кава", "Чай", "Їжа", "Інше"],
        message: "Категорія має бути: Кава, Чай, Їжа або Інше",
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Тиждень 11: Cascade для many-to-many (через OrderItem).
// Стратегія: pull-з-items + delete-empty-orders.
//   1) Прибираємо всі OrderItem, що посилаються на цей напій.
//   2) Якщо якесь замовлення внаслідок цього залишилося без позицій — видаляємо його.
// Спрацьовує для Drink.findByIdAndDelete() / Drink.findOneAndDelete().
// УВАГА: для Drink.deleteOne() / .deleteMany() потрібні окремі хуки.
drinkSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    const OrderItem = mongoose.model("OrderItem");
    const Order = mongoose.model("Order");

    // Які замовлення зачеплені? (до видалення items)
    const affectedOrderIds = await OrderItem.find({ drink: doc._id }).distinct("order");

    // 1) Видаляємо позиції з цим напоєм
    await OrderItem.deleteMany({ drink: doc._id });

    // 2) Для кожного зачепленого замовлення — перевіряємо, чи лишилися позиції,
    //    і якщо ні — видаляємо порожнє замовлення.
    for (const orderId of affectedOrderIds) {
      const remaining = await OrderItem.countDocuments({ order: orderId });
      if (remaining === 0) {
        await Order.deleteOne({ _id: orderId });
      }
    }
  }
  next();
});

export default mongoose.models.Drink || mongoose.model("Drink", drinkSchema);
