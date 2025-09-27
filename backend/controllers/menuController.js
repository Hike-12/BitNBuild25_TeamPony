const Menu = require('../models/Menu');
const MenuItem = require('../models/MenuItem');
const TiffinVendor = require('../models/TiffinVendor');

// Get all daily menus for a vendor (optionally filter by date)
exports.getDailyMenus = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { date } = req.query;
    let filter = { vendor: vendorId };
    if (date) filter.date = new Date(date);

    const menus = await Menu.find(filter)
      .populate('main_items')
      .populate('side_items')
      .populate('extras')
      .sort({ date: -1, name: 1 });

    res.json({ success: true, menus });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a new daily menu
exports.createDailyMenu = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const {
      name, date, image, main_items, side_items, extras,
      full_dabba_price, max_dabbas, todays_special, cooking_style
    } = req.body;

    if (!name || !date || !full_dabba_price) {
      return res.status(400).json({ success: false, error: 'Name, date, and price required' });
    }

    // Check for duplicate menu
    const exists = await Menu.findOne({ vendor: vendorId, name, date: new Date(date) });
    if (exists) {
      return res.status(400).json({ success: false, error: 'Menu with this name and date already exists' });
    }

    // Create menu
    const menu = new Menu({
      vendor: vendorId,
      name,
      date: new Date(date),
      image,
      main_items,
      side_items,
      extras,
      full_dabba_price,
      max_dabbas,
      todays_special,
      cooking_style
    });

    // Auto-detect veg-only
    const allItemIds = [...(main_items || []), ...(side_items || []), ...(extras || [])];
    if (allItemIds.length > 0) {
      const items = await MenuItem.find({ _id: { $in: allItemIds } });
      menu.is_veg_only = !items.some(item => !item.is_vegetarian);
    }

    await menu.save();
    res.json({ success: true, menu });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all menu items for a vendor
exports.getMenuItems = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const items = await MenuItem.find({ vendor: vendorId }).sort({ category: 1, name: 1 });
    res.json({ success: true, menu_items: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a menu item
exports.createMenuItem = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { name, category, price, is_vegetarian, is_spicy, is_available_today } = req.body;
    if (!name || !category || price == null) {
      return res.status(400).json({ success: false, error: 'Name, category, and price required' });
    }
    const exists = await MenuItem.findOne({ vendor: vendorId, name });
    if (exists) {
      return res.status(400).json({ success: false, error: 'Menu item with this name already exists' });
    }
    const item = new MenuItem({
      vendor: vendorId,
      name,
      category,
      price,
      is_vegetarian,
      is_spicy,
      is_available_today
    });
    await item.save();
    res.json({ success: true, menu_item: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};