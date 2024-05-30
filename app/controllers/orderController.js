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


  // async cancel(req, res) {
  //   try {
  //       const bookId = req.query.id;
  //       await StorageService.returnBook(bookId);
  //       return res.json({ message: 'Вы успешно отменили заказ' });
  //   } catch (error) {
  //     if(error.isUserError) {
  //       return res.json({ message: error.message });
  //     }
  //     else {
  //       console.log(error);
  //     }
  //   }
  // }

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
      const bookIds = await OrderService.delete(id);
      
      for (const bookId of bookIds) {
        await StorageService.returnBook(bookId);
      }

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

