const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/dashboard', menuController.getVendorDashboard);
// Menu Items
router.get('/menu-items', menuController.getMenuItems);
router.post('/menu-items', menuController.createMenuItem);

// Daily Menus
router.get('/daily-menus', menuController.getDailyMenus);
router.post('/daily-menus', menuController.createDailyMenu);

module.exports = router;