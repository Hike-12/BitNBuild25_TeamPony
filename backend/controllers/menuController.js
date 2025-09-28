const Menu = require('../models/Menu');
const MenuItem = require('../models/MenuItem');
const TiffinVendor = require('../models/TiffinVendor');

exports.getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    // Get TiffinVendor details
    const tiffin_vendor = await TiffinVendor.findById(vendorId).select('-password');
    if (!tiffin_vendor) {
      return res.status(404).json({
        success: false,
        error: 'Tiffin vendor profile not found'
      });
    }

    // Get statistics
    const total_menu_items = await MenuItem.countDocuments({ vendor: vendorId });
    const active_menu_items = await MenuItem.countDocuments({ vendor: vendorId, is_available_today: true });
    const total_menus = await Menu.countDocuments({ vendor: vendorId });
    const active_menus = await Menu.countDocuments({ vendor: vendorId, is_active: true });

    // Get recent menus (last 5)
    const recent_menus = await Menu.find({ vendor: vendorId })
      .populate('main_items')
      .populate('side_items') 
      .populate('extras')
      .sort({ date: -1 })
      .limit(5);

    // Format recent menus data with proper null checks
    const recent_menus_data = recent_menus.map(menu => {
      // Calculate total items across all categories
      const total_items = (
        (menu.main_items?.length || 0) + 
        (menu.side_items?.length || 0) + 
        (menu.extras?.length || 0)
      );

      return {
        _id: menu._id,
        name: menu.name || 'Unnamed Menu',
        date: menu.date ? menu.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        items_count: total_items,
        full_dabba_price: (menu.full_dabba_price || 0).toString(),
        dabbas_sold: menu.dabbas_sold || 0,
        max_dabbas: menu.max_dabbas || 0,
        dabbas_remaining: Math.max(0, (menu.max_dabbas || 0) - (menu.dabbas_sold || 0)),
        is_active: menu.is_active !== undefined ? menu.is_active : true,
        is_veg_only: menu.is_veg_only !== undefined ? menu.is_veg_only : true,
        todays_special: menu.todays_special || '',
        cooking_style: menu.cooking_style || ''
      };
    });

    return res.json({
      success: true,
      dashboard_data: {
        vendor_info: {
          kitchen_name: tiffin_vendor.business_name || tiffin_vendor.kitchen_name || 'Unnamed Kitchen',
          is_verified: tiffin_vendor.is_verified || false,
          is_active: tiffin_vendor.is_active || true,
        },
        statistics: {
          total_menu_items,
          active_menu_items,
          total_menus,
          active_menus,
        },
        recent_menus: recent_menus_data,
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

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
      name, 
      date, 
      image, 
      main_items, 
      side_items, 
      extras,
      full_dabba_price, 
      max_dabbas, 
      todays_special, 
      cooking_style,
      description,
      is_veg_only,
      is_active
    } = req.body;

    if (!name || !date || !full_dabba_price) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, date, and price are required' 
      });
    }

    // Check for duplicate menu
    const exists = await Menu.findOne({ 
      vendor: vendorId, 
      name, 
      date: new Date(date) 
    });
    
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Menu with this name and date already exists' 
      });
    }

    // Create menu
    const menu = new Menu({
      vendor: vendorId,
      name,
      date: new Date(date),
      image: image || '',
      main_items: main_items || [],
      side_items: side_items || [],
      extras: extras || [],
      full_dabba_price,
      max_dabbas: max_dabbas || 30,
      todays_special: todays_special || '',
      cooking_style: cooking_style || '',
      description: description || '',
      is_active: is_active !== undefined ? is_active : true
    });

    // Auto-detect veg-only if not explicitly set
    if (is_veg_only === undefined) {
      const allItemIds = [...(main_items || []), ...(side_items || []), ...(extras || [])];
      if (allItemIds.length > 0) {
        const items = await MenuItem.find({ _id: { $in: allItemIds } });
        menu.is_veg_only = items.every(item => item.is_vegetarian !== false);
      } else {
        menu.is_veg_only = true; // Default to veg if no items
      }
    } else {
      menu.is_veg_only = is_veg_only;
    }

    await menu.save();
    
    // Populate the saved menu before sending response
    const populatedMenu = await Menu.findById(menu._id)
      .populate('main_items')
      .populate('side_items')
      .populate('extras');
    
    res.json({ success: true, menu: populatedMenu });
  } catch (err) {
    console.error('Create daily menu error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update daily menu
exports.updateDailyMenu = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const menuId = req.params.id;
    const updates = req.body;

    // Find menu and verify it belongs to the vendor
    const menu = await Menu.findOne({ 
      _id: menuId, 
      vendor: vendorId 
    });

    if (!menu) {
      return res.status(404).json({
        success: false,
        error: 'Menu not found'
      });
    }

    // Update menu fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        menu[key] = updates[key];
      }
    });

    await menu.save();

    res.json({
      success: true,
      message: 'Menu updated successfully',
      menu
    });

  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all menu items for a vendor
exports.getMenuItems = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const items = await MenuItem.find({ vendor: vendorId })
      .sort({ category: 1, name: 1 });
    
    res.json({ 
      success: true, 
      menu_items: items 
    });
  } catch (err) {
    console.error('Get menu items error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Create a menu item
exports.createMenuItem = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { 
      name, 
      category, 
      price, 
      is_vegetarian, 
      is_spicy, 
      is_available_today 
    } = req.body;
    
    if (!name || !category || price == null) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, category, and price are required' 
      });
    }
    
    const exists = await MenuItem.findOne({ 
      vendor: vendorId, 
      name 
    });
    
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Menu item with this name already exists' 
      });
    }
    
    const item = new MenuItem({
      vendor: vendorId,
      name,
      category,
      price,
      is_vegetarian: is_vegetarian !== undefined ? is_vegetarian : true,
      is_spicy: is_spicy !== undefined ? is_spicy : false,
      is_available_today: is_available_today !== undefined ? is_available_today : true
    });
    
    await item.save();
    
    res.json({ 
      success: true, 
      menu_item: item 
    });
  } catch (err) {
    console.error('Create menu item error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};