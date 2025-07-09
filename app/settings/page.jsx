"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Mail, 
  Moon, 
  Sun,
  Globe,
  CreditCard,
  Trash2,
  ArrowLeft,
  Check,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    marketingEmails: false,
    newProducts: true,
    priceDrops: true,
    pushNotifications: true,
    smsNotifications: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    showWishlist: false,
    showReviews: true,
    dataCollection: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // Handle password change logic here
    console.log("Password change requested");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-yellow-400/5 rounded-lg border border-yellow-400/10 hover:bg-yellow-400/10 transition-colors">
      <div className="flex-1">
        <p className="text-white font-medium">{label}</p>
        {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black ${
          checked ? 'bg-yellow-400' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                <p className="text-gray-400">Manage your account preferences and security</p>
              </div>
              <Link href="/profile">
                <Button variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Profile
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Security Settings */}
            <div className="space-y-6">
              <Card className="bg-black/80 border border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Change Password */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Current Password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                          className="bg-black/60 border-yellow-400/30 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New Password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                          className="bg-black/60 border-yellow-400/30 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm New Password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                          className="bg-black/60 border-yellow-400/30 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black"
                      >
                        Update Password
                      </Button>
                    </form>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="pt-6 border-t border-yellow-400/20">
                    <h3 className="text-white font-semibold mb-4">Two-Factor Authentication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-yellow-400/5 rounded-lg border border-yellow-400/10">
                        <div>
                          <p className="text-white font-medium">SMS Authentication</p>
                          <p className="text-gray-400 text-sm">Receive codes via text message</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                          Enable
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-yellow-400/5 rounded-lg border border-yellow-400/10">
                        <div>
                          <p className="text-white font-medium">Authenticator App</p>
                          <p className="text-gray-400 text-sm">Use Google Authenticator or similar</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                          Setup
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="pt-6 border-t border-yellow-400/20">
                    <h3 className="text-white font-semibold mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Profile Visibility</label>
                        <select
                          value={privacy.profileVisibility}
                          onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                          className="w-full bg-black/60 border border-yellow-400/30 text-white rounded-lg px-4 py-2"
                        >
                          <option value="public">Public</option>
                          <option value="friends">Friends Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      
                      <ToggleSwitch
                        checked={privacy.showWishlist}
                        onChange={() => handlePrivacyChange('showWishlist', !privacy.showWishlist)}
                        label="Show Wishlist"
                        description="Allow others to see your wishlist"
                      />
                      
                      <ToggleSwitch
                        checked={privacy.showReviews}
                        onChange={() => handlePrivacyChange('showReviews', !privacy.showReviews)}
                        label="Show Reviews"
                        description="Display your product reviews publicly"
                      />
                      
                      <ToggleSwitch
                        checked={privacy.dataCollection}
                        onChange={() => handlePrivacyChange('dataCollection', !privacy.dataCollection)}
                        label="Data Collection"
                        description="Allow us to collect usage data to improve your experience"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card className="bg-black/80 border border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ToggleSwitch
                    checked={notifications.orderUpdates}
                    onChange={() => handleNotificationChange('orderUpdates')}
                    label="Order Updates"
                    description="Get notified about order status changes"
                  />
                  
                  <ToggleSwitch
                    checked={notifications.marketingEmails}
                    onChange={() => handleNotificationChange('marketingEmails')}
                    label="Marketing Emails"
                    description="Receive promotional offers and deals"
                  />
                  
                  <ToggleSwitch
                    checked={notifications.newProducts}
                    onChange={() => handleNotificationChange('newProducts')}
                    label="New Product Alerts"
                    description="Be first to know about new arrivals"
                  />
                  
                  <ToggleSwitch
                    checked={notifications.priceDrops}
                    onChange={() => handleNotificationChange('priceDrops')}
                    label="Price Drop Alerts"
                    description="Get notified when wishlist items go on sale"
                  />
                  
                  <ToggleSwitch
                    checked={notifications.pushNotifications}
                    onChange={() => handleNotificationChange('pushNotifications')}
                    label="Push Notifications"
                    description="Receive browser notifications"
                  />
                  
                  <ToggleSwitch
                    checked={notifications.smsNotifications}
                    onChange={() => handleNotificationChange('smsNotifications')}
                    label="SMS Notifications"
                    description="Get text messages for important updates"
                  />
                </CardContent>
              </Card>

              {/* App Preferences */}
              <Card className="bg-black/80 border border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-2" />
                    App Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Theme</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                          theme === 'dark' 
                            ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400' 
                            : 'bg-black/60 border-yellow-400/30 text-white hover:bg-yellow-400/10'
                        }`}
                      >
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                          theme === 'light' 
                            ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400' 
                            : 'bg-black/60 border-yellow-400/30 text-white hover:bg-yellow-400/10'
                        }`}
                      >
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </button>
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-black/60 border border-yellow-400/30 text-white rounded-lg px-4 py-2"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Currency</label>
                    <select
                      className="w-full bg-black/60 border border-yellow-400/30 text-white rounded-lg px-4 py-2"
                      defaultValue="usd"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="jpy">JPY (¥)</option>
                      <option value="cad">CAD ($)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="bg-black/80 border border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center">
                    <Trash2 className="w-5 h-5 mr-2" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                    <h3 className="text-white font-medium mb-2">Delete Account</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                      Delete Account
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                    <h3 className="text-white font-medium mb-2">Export Data</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Download a copy of all your account data including orders, reviews, and preferences.
                    </p>
                    <Button variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Save Changes */}
          <div className="mt-8 flex justify-center">
            <Button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold">
              <Check className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
