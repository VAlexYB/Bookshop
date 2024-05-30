const UserInfoService = require('../core/services/userInfoService');
const CartService = require('../core/services/cartService');

class userInfoController {
    async getUsers(req, res) {
        try {
            const users = await UserInfoService.getUsers();
            res.json(users);

        } catch (error) {
            if(error.isUserError) {
                return res.json({ message: error.message });
            }
            else {
                console.log(error);
            }
        }
    }

    async getManagers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 20;
            const mgrs = await UserInfoService.getManagers(page, pageSize);
            res.json(mgrs);
        } catch (error) {
            if(error.isUserError) {
                return res.json({ message: error.message });
            }
            else {
                console.log(error);
            }
        }
    }

    async addWallet(req, res) {
        try {
            const userId = req.userId;
            const cardId = req.body.cardId;
            await UserInfoService.addWallet(userId, cardId);
            res.json({message: "Кошелек успешно добавлен"});
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
            const userId = req.userId;
            const user = await UserInfoService.getById(userId);
            res.json(user);
        } catch (error) {
            if(error.isUserError) {
                return res.json({ message: error.message });
            }
            else {
                console.log(error);
            }
        }
    }

    async changeProfile(req, res) {
        try {
            const data = req.body;
            data.userId = req.userId;
            const result = await UserInfoService.changeProfile(data);
            if (result) {
                return res.json({ message: "Профиль успешно изменен" });
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

    async getBuyerInfo(req, res) {
        try {
            const userId = req.userId;
            const user = await UserInfoService.getById(userId);
            const cartPrice = await CartService.getTotalCost(userId);
            const response = {
                user: user,
                cartPrice: cartPrice
            };
            res.json(response);
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

module.exports = new userInfoController();