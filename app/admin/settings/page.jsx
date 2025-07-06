"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  Bell,
  Shield,
  Globe,
  Mail,
  Smartphone,
  CreditCard,
  Database,
  Users,
  Package,
  Truck,
  Store,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changes, setChanges] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      } else {
        console.error("Error fetching settings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updatedSettings = { ...settings, ...changes };
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state with saved settings
        setSettings(data.settings);
        setChanges({});
        
        // Show success message
        alert("Settings saved successfully!");
      } else {
        console.error("Error saving settings:", data.error);
        alert("Failed to save settings. Please try again.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setChanges(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const getCurrentValue = (section, key) => {
    return changes[section]?.[key] ?? settings[section]?.[key];
  };

  const hasChanges = Object.keys(changes).length > 0;

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "inventory", label: "Inventory", icon: Package }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Site Name</label>
            <input
              type="text"
              value={getCurrentValue("general", "siteName") || ""}
              onChange={(e) => updateSetting("general", "siteName", e.target.value)}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Tagline</label>
            <input
              type="text"
              value={getCurrentValue("general", "tagline") || ""}
              onChange={(e) => updateSetting("general", "tagline", e.target.value)}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
            <textarea
              value={getCurrentValue("general", "description") || ""}
              onChange={(e) => updateSetting("general", "description", e.target.value)}
              rows={3}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={getCurrentValue("general", "contactEmail") || ""}
              onChange={(e) => updateSetting("general", "contactEmail", e.target.value)}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
            <input
              type="tel"
              value={getCurrentValue("general", "contactPhone") || ""}
              onChange={(e) => updateSetting("general", "contactPhone", e.target.value)}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80 mb-2">Address</label>
            <textarea
              value={getCurrentValue("general", "address") || ""}
              onChange={(e) => updateSetting("general", "address", e.target.value)}
              rows={2}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Localization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Timezone</label>
            <select
              value={getCurrentValue("general", "timezone") || ""}
              onChange={(e) => updateSetting("general", "timezone", e.target.value)}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            >
              <option value="Asia/Colombo">Asia/Colombo</option>
              <option value="Asia/Dhaka">Asia/Dhaka</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Currency</label>
            <select
              value={getCurrentValue("general", "currency") || ""}
              onChange={(e) => updateSetting("general", "currency", e.target.value)}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            >
              <option value="LKR">Sri Lankan Rupee (LKR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Language</label>
            <select
              value={getCurrentValue("general", "language") || ""}
              onChange={(e) => updateSetting("general", "language", e.target.value)}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            >
              <option value="en">English</option>
              <option value="si">Sinhala</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
            { key: "smsNotifications", label: "SMS Notifications", desc: "Receive notifications via SMS" },
            { key: "orderUpdates", label: "Order Updates", desc: "Get notified about order status changes" },
            { key: "stockAlerts", label: "Stock Alerts", desc: "Get alerted when products are low in stock" },
            { key: "customerMessages", label: "Customer Messages", desc: "Receive customer inquiries and messages" },
            { key: "systemAlerts", label: "System Alerts", desc: "Important system and security notifications" },
            { key: "marketingEmails", label: "Marketing Emails", desc: "Promotional and marketing communications" }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-400/10">
              <div>
                <h4 className="text-white font-medium">{setting.label}</h4>
                <p className="text-white/60 text-sm">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={getCurrentValue("notifications", setting.key) || false}
                  onChange={(e) => updateSetting("notifications", setting.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Authentication & Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-400/10">
            <div>
              <h4 className="text-white font-medium">Two-Factor Authentication</h4>
              <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={getCurrentValue("security", "twoFactorAuth") || false}
                onChange={(e) => updateSetting("security", "twoFactorAuth", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={getCurrentValue("security", "sessionTimeout") || ""}
                onChange={(e) => updateSetting("security", "sessionTimeout", parseInt(e.target.value))}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password Expiry (days)</label>
              <input
                type="number"
                value={getCurrentValue("security", "passwordExpiry") || ""}
                onChange={(e) => updateSetting("security", "passwordExpiry", parseInt(e.target.value))}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Max Login Attempts</label>
              <input
                type="number"
                value={getCurrentValue("security", "loginAttempts") || ""}
                onChange={(e) => updateSetting("security", "loginAttempts", parseInt(e.target.value))}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">API Rate Limit (per hour)</label>
              <input
                type="number"
                value={getCurrentValue("security", "apiRateLimit") || ""}
                onChange={(e) => updateSetting("security", "apiRateLimit", parseInt(e.target.value))}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {[
            { key: "enablePayHere", label: "PayHere", desc: "Sri Lankan payment gateway" },
            { key: "enableStripe", label: "Stripe", desc: "International payment processing" },
            { key: "enableCashOnDelivery", label: "Cash on Delivery", desc: "Pay when you receive your order" },
            { key: "enableBankTransfer", label: "Bank Transfer", desc: "Direct bank transfer payments" }
          ].map((method) => (
            <div key={method.key} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-400/10">
              <div>
                <h4 className="text-white font-medium">{method.label}</h4>
                <p className="text-white/60 text-sm">{method.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={getCurrentValue("payment", method.key) || false}
                  onChange={(e) => updateSetting("payment", method.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">PayHere API Key</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={getCurrentValue("payment", "payHereApiKey") || ""}
                onChange={(e) => updateSetting("payment", "payHereApiKey", e.target.value)}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 pr-10 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-white/60 hover:text-yellow-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Shipping Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-400/10">
            <div>
              <h4 className="text-white font-medium">Free Shipping</h4>
              <p className="text-white/60 text-sm">Enable free shipping for orders above threshold</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={getCurrentValue("shipping", "enableFreeShipping") || false}
                onChange={(e) => updateSetting("shipping", "enableFreeShipping", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Free Shipping Threshold (LKR)</label>
              <input
                type="number"
                value={getCurrentValue("shipping", "freeShippingThreshold") || ""}
                onChange={(e) => updateSetting("shipping", "freeShippingThreshold", parseFloat(e.target.value))}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Default Shipping Cost (LKR)</label>
              <input
                type="number"
                value={getCurrentValue("shipping", "defaultShippingCost") || ""}
                onChange={(e) => updateSetting("shipping", "defaultShippingCost", parseFloat(e.target.value))}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Express Shipping Cost (LKR)</label>
              <input
                type="number"
                value={getCurrentValue("shipping", "expressShippingCost") || ""}
                onChange={(e) => updateSetting("shipping", "expressShippingCost", parseFloat(e.target.value))}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Delivery Time</label>
              <input
                type="text"
                value={getCurrentValue("shipping", "deliveryTime") || ""}
                onChange={(e) => updateSetting("shipping", "deliveryTime", e.target.value)}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventorySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Stock Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-400/10">
            <div>
              <h4 className="text-white font-medium">Auto Reorder</h4>
              <p className="text-white/60 text-sm">Automatically reorder products when stock is low</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={getCurrentValue("inventory", "autoReorderEnabled") || false}
                onChange={(e) => updateSetting("inventory", "autoReorderEnabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-400/10">
            <div>
              <h4 className="text-white font-medium">Enable Backorders</h4>
              <p className="text-white/60 text-sm">Allow customers to order out-of-stock items</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={getCurrentValue("inventory", "enableBackorders") || false}
                onChange={(e) => updateSetting("inventory", "enableBackorders", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Low Stock Threshold</label>
              <input
                type="number"
                value={getCurrentValue("inventory", "lowStockThreshold") || ""}
                onChange={(e) => updateSetting("inventory", "lowStockThreshold", parseInt(e.target.value))}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Auto Reorder Quantity</label>
              <input
                type="number"
                value={getCurrentValue("inventory", "autoReorderQuantity") || ""}
                onChange={(e) => updateSetting("inventory", "autoReorderQuantity", parseInt(e.target.value))}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Stock Display Mode</label>
              <select
                value={getCurrentValue("inventory", "stockDisplayMode") || ""}
                onChange={(e) => updateSetting("inventory", "stockDisplayMode", e.target.value)}
                className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              >
                <option value="exact">Show exact quantity</option>
                <option value="approximate">Show approximate (Low/Medium/High)</option>
                <option value="hide">Hide stock information</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "payment":
        return renderPaymentSettings();
      case "shipping":
        return renderShippingSettings();
      case "inventory":
        return renderInventorySettings();
      default:
        return renderGeneralSettings();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-yellow-400/20 border-l-yellow-400 rounded-full animate-spin"></div>
          <p className="text-white/60 mt-4">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-black" />
            </div>
            Settings
          </h1>
          <p className="text-white/60 mt-2">Configure your TechZone store settings</p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              You have unsaved changes
            </span>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-zinc-800/50 rounded-lg border border-yellow-400/10 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
                    : "border-transparent text-white/60 hover:text-white hover:bg-yellow-400/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-zinc-800/50 rounded-lg p-6 border border-yellow-400/10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}
