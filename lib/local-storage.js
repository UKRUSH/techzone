// Temporary local storage fallback for admin when MongoDB is not available
export class LocalProductStorage {
  constructor() {
    this.storageKey = 'techzone_admin_products';
    this.categoriesKey = 'techzone_admin_categories';
    this.brandsKey = 'techzone_admin_brands';
    this.initializeData();
  }

  initializeData() {
    // Initialize default categories if not exists
    if (!localStorage.getItem(this.categoriesKey)) {
      const defaultCategories = [
        { id: "cpu", name: "CPU", slug: "cpu", description: "Central Processing Units" },
        { id: "gpu", name: "GPU", slug: "gpu", description: "Graphics Processing Units" },
        { id: "memory", name: "Memory", slug: "memory", description: "RAM and Memory modules" },
        { id: "storage", name: "Storage", slug: "storage", description: "Storage devices" },
        { id: "motherboard", name: "Motherboard", slug: "motherboard", description: "Motherboards" },
        { id: "power-supply", name: "Power Supply", slug: "power-supply", description: "Power Supply Units" },
        { id: "cooling", name: "Cooling", slug: "cooling", description: "Cooling solutions" },
        { id: "case", name: "Case", slug: "case", description: "PC Cases" }
      ];
      localStorage.setItem(this.categoriesKey, JSON.stringify(defaultCategories));
    }

    // Initialize default brands if not exists
    if (!localStorage.getItem(this.brandsKey)) {
      const defaultBrands = [
        { id: "intel", name: "Intel", slug: "intel", description: "Intel Corporation" },
        { id: "amd", name: "AMD", slug: "amd", description: "Advanced Micro Devices" },
        { id: "nvidia", name: "NVIDIA", slug: "nvidia", description: "NVIDIA Corporation" },
        { id: "corsair", name: "Corsair", slug: "corsair", description: "Corsair Gaming" },
        { id: "samsung", name: "Samsung", slug: "samsung", description: "Samsung Electronics" },
        { id: "asus", name: "ASUS", slug: "asus", description: "ASUSTeK Computer" },
        { id: "msi", name: "MSI", slug: "msi", description: "Micro-Star International" },
        { id: "gigabyte", name: "Gigabyte", slug: "gigabyte", description: "Gigabyte Technology" }
      ];
      localStorage.setItem(this.brandsKey, JSON.stringify(defaultBrands));
    }

    // Initialize empty products array if not exists
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  getCategories() {
    try {
      return JSON.parse(localStorage.getItem(this.categoriesKey) || '[]');
    } catch {
      return [];
    }
  }

  getBrands() {
    try {
      return JSON.parse(localStorage.getItem(this.brandsKey) || '[]');
    } catch {
      return [];
    }
  }

  addProduct(productData) {
    const products = this.getProducts();
    const categories = this.getCategories();
    const brands = this.getBrands();
    
    // Find category and brand objects
    const category = categories.find(c => c.id === productData.categoryId);
    const brand = brands.find(b => b.id === productData.brandId);
    
    const newProduct = {
      id: Date.now().toString(), // Simple ID generation
      name: productData.name,
      description: productData.description,
      category: category,
      brand: brand,
      categoryId: productData.categoryId,
      brandId: productData.brandId,
      variants: productData.variants || [],
      createdAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
    
    products.unshift(newProduct); // Add to beginning
    localStorage.setItem(this.storageKey, JSON.stringify(products));
    
    return newProduct;
  }

  deleteProduct(productId) {
    const products = this.getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredProducts));
    return true;
  }

  updateProduct(productId, updateData) {
    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex >= 0) {
      products[productIndex] = { ...products[productIndex], ...updateData };
      localStorage.setItem(this.storageKey, JSON.stringify(products));
      return products[productIndex];
    }
    
    return null;
  }

  exportData() {
    return {
      products: this.getProducts(),
      categories: this.getCategories(),
      brands: this.getBrands(),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data) {
    if (data.products) {
      localStorage.setItem(this.storageKey, JSON.stringify(data.products));
    }
    if (data.categories) {
      localStorage.setItem(this.categoriesKey, JSON.stringify(data.categories));
    }
    if (data.brands) {
      localStorage.setItem(this.brandsKey, JSON.stringify(data.brands));
    }
  }
}

// Export for use in admin
if (typeof window !== 'undefined') {
  window.LocalProductStorage = LocalProductStorage;
}
