const StorageService = require('../core/services/storageService');
const UserInfoService = require('../core/services/userInfoService');

class OrderController {  
  async getFilteredOrders(req, res) {
    try {
      const filter = req.body;
    //   const books = await BookService.getFilteredBooks(filter);
    //   res.json(books);
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
        orderInfo.price = parseFloat(price) * 1.1;
        orderInfo.recipient = `${user.surname} ${user.name} ${user.patronimyc}}`;
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

  async delete(req, res) {
    try {
      const id = req.query.id;
    //   const result = await BookService.delete(id);
    //   if(result) {
    //     return res.json({ message: "Книга успешно удалена" });
    //   }
    //   return res.json({ message: "Неизвестная ошибка" });
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

