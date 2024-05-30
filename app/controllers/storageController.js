const StorageService = require('../core/services/storageService');

class StorageController {
    async addSupply(req, res) {
        try {
            const data = req.body;
            const result = await StorageService.addSupply(data);
            if (result) {
                return res.json({ message: "Поставка успешно добавлена" });
            } else {
                return res.json({ message: "Неизвестная ошибка" });
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

    async getStorages(req, res) {
        try {
            console.log(req.body);
            const filter = req.body;
            const storages = await StorageService.getFilteredStorages(filter);
            res.json(storages);
        } catch (error) {
            if(error.isUserError) {
                return res.json({ message: error.message });
            }
            else {
                console.log(error);
            }
        }
    }

    async setPrice(req, res) {
        try {
            const data = req.body;
            const result = await StorageService.setPrice(data);
            if(result) {
                return res.json({ message: "Цена успешно установлена" });
            }
            return res.json({ message: "Неизвестная ошибка"});
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

module.exports = new StorageController();