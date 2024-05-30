const CartService = require('../core/services/cartService')
const StorageService = require('../core/services/storageService');
const UserInfoService = require('../core/services/userInfoService');

class CartController {  
    async addToCart(req, res) {
        try {
            const data = {
                bookId: req.query.id,
                userId: req.userId
            }

            const user = await UserInfoService.getById(data.userId);
            if(!user.hasLinkedCard) {
                return res.json({ message: 'Для совершения покупок у вас должна быть привязана карта'});
            }

            await StorageService.reserveBook(data.bookId);

            const result =  await CartService.addToCart(data);
            if(result) {
                return res.json({ message: "Книга успешно добавлена в корзину" });
            }
            
        } catch (error) {
            if(error.isUserError) {
                return res.json({ message: error.message });
            }
            else {
                console.log(error);
            }
        }
    }

    async removeFromCart(req, res) {
        try {
            const data = {
                bookId: req.query.id,
                userId: req.userId
            }

            const result =  await CartService.removeFromCart(data);
            await StorageService.returnBook(data.bookId);

            if(result) {
                return res.json({ message: "Книга успешно удалена из корзины" });
            }
        } catch (error) {
            if(error.isUserError) {
                return res.json({ message: error.message });
            }
            else {
                console.log(error);
            }
        }
    }

    async getCartSummary(req, res) {
        try {
            const response = await CartService.getCartSummary(req.userId);
            console.log(response);
            return res.json(response);
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

module.exports = new CartController();

