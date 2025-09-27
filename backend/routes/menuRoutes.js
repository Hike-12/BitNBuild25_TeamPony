const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const Menu = require('../models/Menu'); // Add this import

// PUBLIC ROUTES (BEFORE auth middleware)
router.get('/public/daily-menus', async (req, res) => {
  try {
    const menus = await Menu.find({ is_active: true })
      .populate('vendor', 'business_name address phone_number')
      .populate('main_items side_items extras')
      .sort({ date: -1 });

    res.json({ success: true, menus });
  } catch (err) {
    console.error('Public menus error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PROTECTED ROUTES (AFTER auth middleware)
router.use(auth);

router.get('/dashboard', menuController.getVendorDashboard);
router.get('/menu-items', menuController.getMenuItems);
router.post('/menu-items', menuController.createMenuItem);
router.get('/daily-menus', menuController.getDailyMenus);
router.post('/daily-menus', menuController.createDailyMenu);

// Add PATCH route for updating menus
router.patch('/daily-menus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const vendorId = req.vendor._id;

    const menu = await Menu.findOneAndUpdate(
      { _id: id, vendor: vendorId },
      updates,
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({
        success: false,
        error: 'Menu not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu updated successfully',
      menu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;