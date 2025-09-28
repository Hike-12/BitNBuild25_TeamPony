const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const Menu = require('../models/Menu'); // Add this import

router.get('/public/daily-menus', async (req, res) => {
  try {
    console.log('Fetching public menus...');
    
    const menus = await Menu.find({ is_active: true })
      .populate('vendor', 'business_name address phone_number')
      .populate({
        path: 'main_items',
        select: 'name price category is_vegetarian'
      })
      .populate({
        path: 'side_items', 
        select: 'name price category is_vegetarian'
      })
      .populate({
        path: 'extras',
        select: 'name price category is_vegetarian'
      })
      .sort({ date: -1 });

    console.log(`Found ${menus.length} menus`);
    
    if (menus.length > 0) {
      console.log('Sample menu structure:', {
        name: menus[0].name,
        main_items: menus[0].main_items?.length || 0,
        side_items: menus[0].side_items?.length || 0,
        extras: menus[0].extras?.length || 0,
        vendor: menus[0].vendor
      });
    }

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