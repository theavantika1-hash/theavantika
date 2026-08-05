import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX, FiArrowLeft, FiArrowRight, FiStar, FiUpload, FiEye, FiEyeOff } from 'react-icons/fi';

const PREDEFINED_CATEGORIES = {
  "Indian": ["North Indian", "South Indian", "Mughlai", "Street Food"],
  "Chinese / Oriental": ["Appetizers", "Mains", "Rice & Noodles", "Soups"],
  "Italian": ["Pasta", "Pizza", "Appetizers", "Salads"],
  "Thai": ["Curries", "Appetizers", "Mains"],
  "Mexican": ["Tacos", "Quesadillas", "Appetizers"],
  "Continental / Fusion": ["Mains", "Sizzlers", "Appetizers"],
  "Desserts": ["Kulfi", "Ice Cream", "Cakes", "Puddings"],
  "Beverages": ["Mocktails", "Teas", "Shakes", "Coolers"]
};

const PREDEFINED_RECIPES = {
  "Indian": {
    "North Indian": [
      "Butter Chicken",
      "Kadai Paneer",
      "Shahi Paneer",
      "Dal Makhani",
      "Chole Bhature",
      "Rajma Chawal",
      "Palak Paneer",
      "Malai Kofta",
      "Paneer Butter Masala",
      "Tandoori Roti",
      "Butter Naan",
      "Garlic Naan"
    ]
  }
};

export default function FoodManagementPage({ menuItems, setMenuItems, showNotification }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    description: '',
    foodType: 'veg',
    image: '',
    prepTime: '',
    foodItems: [], // array of { name: '', quantity: '' }
    subImages: [] // array of Base64 strings
  });

  // Cascaded dropdown helper states
  const [selectedFormCategory, setSelectedFormCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedFormSubcategory, setSelectedFormSubcategory] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [selectedFormFoodId, setSelectedFormFoodId] = useState('new_food_item');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync hidden foods to localStorage
  useEffect(() => {
    const hiddenNames = menuItems.filter(item => item.visibility === false).map(item => item.name.toUpperCase());
    localStorage.setItem('avantika_hidden_foods', JSON.stringify(hiddenNames));
  }, [menuItems]);

  const toggleVisibility = async (id) => {
    const itemToToggle = menuItems.find(item => item.id === id || item._id === id);
    if (!itemToToggle) return;
    const targetId = itemToToggle._id || itemToToggle.id || id;
    const currentVis = itemToToggle.visibility === undefined ? true : itemToToggle.visibility;
    const nextVis = !currentVis;

    try {
      await fetch(`http://localhost:45000/api/foods/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: nextVis })
      });
    } catch (err) {
      console.error("API toggle error:", err);
    }

    setMenuItems(prev => prev.map(item => {
      if (item.id === targetId || item._id === targetId || item.id === id || item._id === id) {
        return {
          ...item,
          visibility: nextVis
        };
      }
      return item;
    }));
    showNotification(`Food item "${itemToToggle.name || itemToToggle.foodName}" is now ${nextVis ? 'LIVE (Visible)' : 'HIDDEN (Offline)'}!`, nextVis ? 'success' : 'info');
  };

  // Unique categories list
  const categories = ['All', ...new Set(menuItems.map(item => item.category || item.foodCategory).filter(Boolean))];

  // Derived lists for form dropdowns
  const allFormCategories = [...new Set([
    ...Object.keys(PREDEFINED_CATEGORIES),
    ...menuItems.map(item => item.category || item.foodCategory).filter(Boolean)
  ])];

  const getSubcategories = (cat) => {
    if (!cat) return [];
    const predefined = PREDEFINED_CATEGORIES[cat] || [];
    const fromItems = menuItems.filter(item => (item.category || item.foodCategory) === cat).map(item => item.subcategory || item.foodSubCategory).filter(Boolean);
    return [...new Set([...predefined, ...fromItems])];
  };

  const getFoods = (cat, sub) => {
    if (!cat) return [];
    return menuItems.filter(item => {
      const itemCat = item.category || item.foodCategory;
      const itemSub = item.subcategory || item.foodSubCategory;
      if (sub) {
        return itemCat === cat && itemSub === sub;
      }
      return itemCat === cat;
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        subImages: [...prev.subImages, ...base64Images]
      }));
    });
  };

  const removeSubImage = (index) => {
    setFormData(prev => ({
      ...prev,
      subImages: prev.subImages.filter((_, i) => i !== index)
    }));
  };

  const makeMainImage = (subIndex) => {
    setFormData(prev => {
      const currentMain = prev.image;
      const targetSub = prev.subImages[subIndex];
      const updatedSub = [...prev.subImages];
      if (currentMain) {
        updatedSub[subIndex] = currentMain;
      } else {
        updatedSub.splice(subIndex, 1);
      }
      return {
        ...prev,
        image: targetSub,
        subImages: updatedSub
      };
    });
  };

  const moveSubImage = (index, direction) => {
    setFormData(prev => {
      const updated = [...prev.subImages];
      const targetIndex = index + direction;
      if (targetIndex >= 0 && targetIndex < updated.length) {
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
      }
      return { ...prev, subImages: updated };
    });
  };

  // Ingredient list handlers
  const handleIngredientChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.foodItems];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, foodItems: updated };
    });
  };

  const addIngredientRow = () => {
    setFormData(prev => ({
      ...prev,
      foodItems: [...prev.foodItems, { name: '', quantity: '' }]
    }));
  };

  const removeIngredientRow = (index) => {
    setFormData(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = (item) => {
    const targetId = item._id || item.id;
    setIsEditing(true);
    setCurrentId(targetId);
    setSelectedFormCategory(item.category || item.foodCategory || '');
    setCustomCategory('');
    setSelectedFormSubcategory(item.subcategory || item.foodSubCategory || '');
    setCustomSubcategory('');
    setSelectedFormFoodId(targetId ? targetId.toString() : 'new_food_item');
    setFormData({
      name: item.name || item.foodName || '',
      price: item.price !== undefined ? item.price : (item.foodPrice !== undefined ? item.foodPrice : ''),
      category: item.category || item.foodCategory || '',
      subcategory: item.subcategory || item.foodSubCategory || '',
      description: item.description || item.foodDescription || '',
      foodType: item.foodType || (item.veg ? 'veg' : 'non-veg'),
      image: item.image || item.foodImage || '',
      prepTime: item.prepTime || item.preparationTime || '',
      foodItems: item.foodItems || [],
      subImages: item.subImages || []
    });
  };

  const handleDelete = async (id) => {
    const itemToDelete = menuItems.find(item => item.id === id || item._id === id);
    if (!itemToDelete) return;
    const targetId = itemToDelete._id || itemToDelete.id || id;

    if (window.confirm(`Are you sure you want to delete "${itemToDelete.name || itemToDelete.foodName}"?`)) {
      try {
        await fetch(`http://localhost:45000/api/foods/${targetId}`, { method: 'DELETE' });
      } catch (err) {
        console.error("API delete error:", err);
      }
      setMenuItems(prev => prev.filter(item => item.id !== targetId && item._id !== targetId && item.id !== id && item._id !== id));
      showNotification("Food item deleted successfully!", "warning");
    }
  };

  const handleReset = () => {
    setIsEditing(false);
    setCurrentId(null);
    setSelectedFormCategory('');
    setCustomCategory('');
    setSelectedFormSubcategory('');
    setCustomSubcategory('');
    setSelectedFormFoodId('new_food_item');
    setFormData({
      name: '',
      price: '',
      category: '',
      subcategory: '',
      description: '',
      foodType: 'veg',
      image: '',
      prepTime: '',
      foodItems: [],
      subImages: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      showNotification("Please fill in Name, Price and Category!", "warning");
      return;
    }

    if (isEditing && currentId) {
      // Update item in backend API
      try {
        const response = await fetch(`http://localhost:45000/api/foods/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const resData = await response.json();
        if (resData.success && resData.data) {
          const updatedItem = resData.data;
          setMenuItems(prev => prev.map(item => (item.id === currentId || item._id === currentId) ? updatedItem : item));
          showNotification("Food item updated successfully!", "success");
        } else {
          setMenuItems(prev => prev.map(item => {
            if (item.id === currentId || item._id === currentId) {
              return {
                ...item,
                ...formData,
                price: Number(formData.price),
                veg: formData.foodType === 'veg' || formData.foodType === 'vegan'
              };
            }
            return item;
          }));
          showNotification("Food item updated!", "success");
        }
      } catch (err) {
        console.error("API update error:", err);
        setMenuItems(prev => prev.map(item => (item.id === currentId || item._id === currentId) ? { ...item, ...formData, price: Number(formData.price) } : item));
        showNotification("Food item updated!", "success");
      }
    } else {
      // Add new item via backend API
      try {
        const response = await fetch('http://localhost:45000/api/foods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const resData = await response.json();
        if (resData.success && resData.data) {
          setMenuItems(prev => [resData.data, ...prev]);
          showNotification("New food item added successfully!", "success");
        } else {
          throw new Error(resData.message || "Failed to add food");
        }
      } catch (err) {
        console.error("API add food error:", err);
        const newItem = {
          id: Date.now(),
          ...formData,
          price: Number(formData.price),
          veg: formData.foodType === 'veg' || formData.foodType === 'vegan',
          rating: 5.0,
          visibility: true
        };
        setMenuItems(prev => [newItem, ...prev]);
        showNotification("New food item added!", "success");
      }
    }
    handleReset();
  };

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      gap: '20px', 
      height: '100%', 
      flex: 1, 
      overflow: isMobile ? 'auto' : 'hidden' 
    }}>
      
      {/* Left side - Product List */}
      <div className="grid-card" style={{ 
        flex: isMobile ? 'none' : 1.3, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        overflowY: isMobile ? 'visible' : 'auto',
        maxHeight: isMobile ? 'none' : '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>🍔 Manage Food Menu</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Add, edit, delete or update food product details.</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search food items..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontWeight: '600' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredItems.map(item => (
            <div 
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--card-shadow)',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img 
                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80"} 
                  alt={item.name} 
                  style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {(() => {
                      const type = item.foodType || (item.veg ? 'veg' : 'non-veg');
                      let color = '#10b981';
                      let label = 'Veg';
                      if (type === 'non-veg') { color = '#ef4444'; label = 'Non-Veg'; }
                      else if (type === 'egg') { color = '#f59e0b'; label = 'Egg'; }
                      else if (type === 'vegan') { color = '#059669'; label = 'Vegan'; }
                      return (
                        <span 
                          style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, display: 'inline-block' }} 
                          title={label}
                        />
                      );
                    })()}
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>{item.name}</h4>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Category: <strong style={{ color: 'var(--accent-color)' }}>{item.category}</strong> {item.subcategory && `(${item.subcategory})`} · Price: <strong>₹{item.price}</strong> · Prep: <strong>⏱️ {item.prepTime || '15 mins'}</strong>
                  </span>

                  {item.foodItems && item.foodItems.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '2px' }}>Ingredients:</span>
                      {item.foodItems.map((ing, idx) => (
                        <span key={idx} style={{ fontSize: '9px', background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                          {ing.name} ({ing.quantity})
                        </span>
                      ))}
                    </div>
                  )}
                  {item.subImages && item.subImages.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginRight: '2px' }}>Gallery:</span>
                      {item.subImages.map((subImg, idx) => (
                        <img 
                          key={idx} 
                          src={subImg} 
                          alt={`Gallery ${idx}`} 
                          style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center',
                justifyContent: isMobile ? 'flex-end' : 'flex-start',
                marginTop: isMobile ? '10px' : '0px',
                borderTop: isMobile ? '1px dashed var(--border-color)' : 'none',
                paddingTop: isMobile ? '10px' : '0px'
              }}>
                {/* Live / Hidden Switch Toggle */}
                {(() => {
                  const isLive = item.visibility === undefined ? true : item.visibility;
                  return (
                    <button
                      onClick={() => toggleVisibility(item._id || item.id)}
                      style={{
                        background: isLive ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-input)',
                        border: isLive ? '1.5px solid #10b981' : '1.5px solid var(--border-color)',
                        color: isLive ? '#10b981' : 'var(--text-muted)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                      title={isLive ? "Toggle Hidden (Turn off live)" : "Toggle Live (Turn on live)"}
                    >
                      {isLive ? <FiEye size={13} /> : <FiEyeOff size={13} />}
                      {isLive ? 'Live' : 'Hidden'}
                    </button>
                  );
                })()}

                <button 
                  onClick={() => handleEdit(item)}
                  style={{ background: 'var(--bg-input)', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}
                  title="Edit details"
                >
                  <FiEdit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(item._id || item.id)}
                  style={{ background: 'var(--bg-input)', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger-color)' }}
                  title="Delete product"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Add / Edit Form */}
      <div className="grid-card" style={{ 
        flex: isMobile ? 'none' : 0.9, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        overflowY: isMobile ? 'visible' : 'auto', 
        maxHeight: isMobile ? 'none' : '100%', 
        paddingRight: '8px', 
        paddingBottom: '30px' 
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
          {isEditing ? "✏️ Edit Food Product" : "✨ Add New Food Item"}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '40px' }}>
          {/* Category Selector Dropdown */}
          <div>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Select Category *</label>
            <select
              value={selectedFormCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedFormCategory(val);
                setSelectedFormSubcategory('');
                setSelectedFormFoodId('new_food_item');
                if (val !== 'custom_category') {
                  setFormData(prev => ({ ...prev, category: val, name: '' }));
                } else {
                  setFormData(prev => ({ ...prev, category: '', name: '' }));
                }
              }}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontWeight: '600' }}
            >
              <option value="">-- Choose Category --</option>
              {allFormCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="custom_category">+ Add Custom Category</option>
            </select>
          </div>

          {selectedFormCategory === 'custom_category' && (
            <div>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Custom Category Name *</label>
              <input
                type="text"
                placeholder="Type custom category (e.g. Continental)"
                value={customCategory}
                required
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomCategory(val);
                  setFormData(prev => ({ ...prev, category: val }));
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              />
            </div>
          )}

          {/* Sub Category Selector Dropdown */}
          {selectedFormCategory && (
            <div>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Select Sub Category *</label>
              <select
                value={selectedFormSubcategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedFormSubcategory(val);
                  setSelectedFormFoodId('new_food_item');
                  if (val !== 'custom_subcategory') {
                    setFormData(prev => ({ ...prev, subcategory: val, name: '' }));
                  } else {
                    setFormData(prev => ({ ...prev, subcategory: '', name: '' }));
                  }
                }}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontWeight: '600' }}
              >
                <option value="">-- Choose Sub Category --</option>
                {getSubcategories(selectedFormCategory).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
                <option value="custom_subcategory">+ Add Custom Sub Category</option>
              </select>
            </div>
          )}

          {selectedFormSubcategory === 'custom_subcategory' && (
            <div>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Custom Sub Category Name *</label>
              <input
                type="text"
                placeholder="Type custom subcategory (e.g. Soups)"
                value={customSubcategory}
                required
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomSubcategory(val);
                  setFormData(prev => ({ ...prev, subcategory: val }));
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              />
            </div>
          )}

          {/* Food Item Selector Dropdown */}
          {selectedFormCategory && (
            <div>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>2nd Sub Category *</label>
              <select
                value={selectedFormFoodId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedFormFoodId(val);
                  if (val === 'new_food_item') {
                    setIsEditing(false);
                    setCurrentId(null);
                    setFormData(prev => ({
                      ...prev,
                      name: '',
                      price: '',
                      description: '',
                      foodItems: [],
                      subImages: []
                    }));
                  } else if (val.startsWith('predefined_')) {
                    const name = val.replace('predefined_', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    setIsEditing(false);
                    setCurrentId(null);
                    setFormData(prev => ({
                      ...prev,
                      name: name,
                      price: '',
                      description: `${name} is a classic gourmet preparation crafted to perfection.`,
                      foodItems: [],
                      subImages: []
                    }));
                  } else {
                    const item = menuItems.find(x => x.id.toString() === val);
                    if (item) {
                      handleEdit(item);
                    }
                  }
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontWeight: '600' }}
              >
                <option value="new_food_item">+ Add New Food Item (Custom)</option>
                {getFoods(selectedFormCategory, selectedFormSubcategory).map(food => (
                  <option key={food.id} value={food.id.toString()}>{food.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Food Name text input (always visible for typing/editing) */}
          <div>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Food Name *</label>
            <input 
              type="text" 
              name="name"
              placeholder="e.g. Garlic Butter Naan"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Price (₹) *</label>
            <input 
              type="number" 
              name="price"
              placeholder="e.g. 299"
              value={formData.price}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Select Food Image</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {formData.image && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: 'var(--danger-color)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      lineHeight: 1
                    }}
                    title="Remove Image"
                  >
                    ×
                  </button>
                </div>
              )}
              <input 
                key={formData.image ? 'image-selected' : 'image-empty'}
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {formData.image && (
            <div>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Select Food Gallery (Sub Images)</label>
              <input 
                key={formData.subImages.length}
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleSubImagesChange}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', marginBottom: '8px' }}
              />
              {formData.subImages && formData.subImages.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                  {formData.subImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={img} 
                        alt={`Gallery Preview ${idx}`} 
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                      />
                      <button 
                        type="button"
                        onClick={() => removeSubImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: 'var(--danger-color)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          lineHeight: 1
                        }}
                        title="Remove Gallery Image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Preparation Time *</label>
            <input 
              type="text" 
              name="prepTime"
              placeholder="e.g. 15 mins"
              value={formData.prepTime}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Ingredients / Items Used</label>
              <button 
                type="button" 
                onClick={addIngredientRow}
                style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FiPlus size={12} /> Add Item
              </button>
            </div>
            
            {formData.foodItems.length === 0 ? (
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontStyle: 'italic', padding: '6px 0' }}>No ingredients added yet.</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px' }}>
                {formData.foodItems.map((ing, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="Item Name (e.g. Garlic)" 
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                      required
                      style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '12px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Quantity (e.g. 10g)" 
                      value={ing.quantity}
                      onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                      required
                      style={{ width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '12px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeIngredientRow(idx)}
                      style={{ background: 'var(--bg-input)', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger-color)' }}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Description</label>
            <textarea 
              name="description"
              placeholder="Brief description of the dish..."
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Food Type *</label>
            <select
              name="foodType"
              value={formData.foodType}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontWeight: '600' }}
            >
              <option value="veg">🟢 Veg</option>
              <option value="non-veg">🔴 Non-Veg</option>
              <option value="egg">🟡 Egg</option>
              <option value="vegan">🌱 Vegan</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 1, background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
            >
              {isEditing ? "Save Changes" : "Add Product"}
            </button>
            <button 
              type="button" 
              onClick={handleReset} 
              className="btn btn-secondary" 
              style={{ flex: 0.5, padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
