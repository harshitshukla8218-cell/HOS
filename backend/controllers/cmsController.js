import db from '../config/db.js';

// Get CMS settings
export const getCMS = async (req, res) => {
  try {
    const cmsSettings = await db.cms.get();
    res.json(cmsSettings);
  } catch (error) {
    console.error('Get CMS error:', error);
    res.status(500).json({ message: 'Server error fetching CMS content' });
  }
};

// Update CMS settings (Admin only)
export const updateCMS = async (req, res) => {
  try {
    const updatedSettings = await db.cms.update(req.body);
    res.json(updatedSettings);
  } catch (error) {
    console.error('Update CMS error:', error);
    res.status(500).json({ message: 'Server error updating CMS content' });
  }
};
