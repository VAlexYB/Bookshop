const OrderService = require('../core/services/orderService');
const StorageService = require('../core/services/storageService');
const UserInfoService = require('../core/services/userInfoService');

class OrderController {  
  async getFilteredOrders(req, res) {
    try {
      const filter = req.body;
      filter.userId = req.userId;
      const orders = await OrderService.getFilteredOrders(filter);
      res.json(orders);
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  } 

  async getById(req, res) {
    try {
      const id = req.query.id;
    //   const book = await BookService.getById(id);
    //   res.json(book);
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }

  async create(req, res) {
    try {
        const userId = req.userId;
        const bookId = req.query.id;

        const user = await UserInfoService.getById(userId);
        if(!user.hasLinkedCard) {
            return res.json({ message: 'Для совершения покупок у вас должна быть привязана карта'});
        }
        const price = await StorageService.takeBookForOrder(bookId);
        const orderInfo = {};
        orderInfo.price = (parseFloat(price) * 1.1).toFixed(2);
        orderInfo.recipient = `${user.surname} ${user.name} ${user.patronimyc}`;
        orderInfo.phone = `${user.phoneNumber}`;
        orderInfo.account = `${user.cardIdFirstDigits}...${user.cardIdLastDigits}`;
        return res.json(orderInfo);
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }

  async cancel(req, res) {
    try {
        const bookId = req.query.id;
        await StorageService.returnBook(bookId);
        return res.json({ message: 'Вы успешно отменили заказ' });
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }

  async confirm(req, res) {
    try {
      const data = req.body;
      data.userId = req.userId;
      const num = await OrderService.create(data);
      return res.json({ message: `Вы успешно оформили заказ. \nНомер вашего закза ${num} `});
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }
  async delete(req, res) {
    try {
      const id = req.query.id;
      const bookId = await OrderService.delete(id);
      
      await StorageService.returnBook(bookId);
      return res.json({ message: "Вы успешно отменили заказ" });
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }
}

module.exports = new OrderController();

