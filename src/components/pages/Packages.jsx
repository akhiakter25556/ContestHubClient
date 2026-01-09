import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AnimatedPage,
  AnimatedCard,
  StaggerContainer,
  StaggerItem,
  buttonVariants
} from "../animations/AnimatedComponents";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [userPackage, setUserPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    fetchPackages();
    fetchUserPackage();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("https://contesthub-akhi.vercel.app/api/packages");
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    }
  };

  const fetchUserPackage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("https://contesthub-akhi.vercel.app/api/user/package", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasPackage) {
          setUserPackage(data.package);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user package:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to purchase a package");
      return;
    }

    setPurchasing(packageId);

    try {
      const response = await fetch(`https://contesthub-akhi.vercel.app/api/packages/${packageId}/purchase`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Package purchased successfully!");
        fetchUserPackage(); // Refresh user package info
      } else {
        alert(data.message || "Failed to purchase package");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Error purchasing package");
    } finally {
      setPurchasing(null);
    }
  };

  const getPackageColor = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      gold: "from-yellow-500 to-orange-500",
      red: "from-red-500 to-pink-600"
    };
    return colors[color] || colors.blue;
  };

  const formatExpiryDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Creator Packages</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Choose the perfect package to start creating amazing contests and grow your audience
            </p>
          </motion.div>
        </div>
      </div>

      {/* Current Package Status */}
      {userPackage && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-200">
                  Active Package: {userPackage.packageName}
                </h3>
                <p className="text-green-600 dark:text-green-400">
                  {userPackage.contestLimit === -1
                    ? "Unlimited contests remaining"
                    : `${userPackage.contestLimit - userPackage.contestsUsed} contests remaining`
                  }
                </p>
                <p className="text-sm text-green-500 dark:text-green-300">
                  Expires: {formatExpiryDate(userPackage.expiresAt)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {userPackage.contestLimit === -1 ? "∞" : userPackage.contestLimit - userPackage.contestsUsed}
                </div>
                <div className="text-sm text-green-500 dark:text-green-300">contests left</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Packages Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, index) => (
            <StaggerItem key={pkg._id || index}>
              <AnimatedCard className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                {/* Package Header */}
                <div className={`bg-gradient-to-r ${getPackageColor(pkg.color)} p-6 text-white text-center`}>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{pkg.description}</p>
                  <div className="text-4xl font-bold mb-1">${pkg.price}</div>
                  <div className="text-sm opacity-75">per month</div>
                </div>

                {/* Package Content */}
                <div className="p-6">
                  {/* Contest Limit */}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {pkg.contestLimit === -1 ? "∞" : pkg.contestLimit}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {pkg.contestLimit === -1 ? "Unlimited contests" : "contests per month"}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Purchase Button */}
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handlePurchase(pkg._id)}
                    disabled={purchasing === pkg._id || (userPackage && !userPackage.expired)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${userPackage && !userPackage.expired
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : `bg-gradient-to-r ${getPackageColor(pkg.color)} text-white hover:shadow-lg`
                      }`}
                  >
                    {purchasing === pkg._id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : userPackage && !userPackage.expired ? (
                      "Current Package"
                    ) : (
                      "Purchase Package"
                    )}
                  </motion.button>
                </div>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                How do packages work?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Each package gives you a specific number of contests you can create within 30 days.
                Once you reach your limit, you'll need to wait for renewal or upgrade to a higher package.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Can I upgrade my package?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Currently, you need to wait for your current package to expire before purchasing a new one.
                We're working on upgrade functionality for future releases.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                What happens to my contests if my package expires?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your existing contests will continue to run normally. You just won't be able to create
                new contests until you purchase a new package.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}