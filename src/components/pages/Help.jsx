import { useState } from "react";

export default function Help() {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "contests", name: "Contests", icon: "🎯" },
    { id: "payments", name: "Payments & Prizes", icon: "💰" },
    { id: "account", name: "Account & Profile", icon: "👤" },
    { id: "technical", name: "Technical Support", icon: "🔧" }
  ];

  const faqs = {
    "getting-started": [
      {
        question: "How do I get started on ContestHub?",
        answer: "Simply create an account by clicking 'Register' and filling out your profile. Once registered, you can browse contests, participate in competitions, and even create your own contests if you're a creator."
      },
      {
        question: "What types of contests are available?",
        answer: "We offer various contest types including Logo Design, Web Design, Article Writing, Photography, UI/UX Design, and more. Each contest has specific requirements and prize amounts."
      },
      {
        question: "Do I need to pay to participate?",
        answer: "Most contests require a small participation fee to ensure serious participants and help fund the prize pool. The fee varies by contest and is clearly displayed before you join."
      },
      {
        question: "How are winners selected?",
        answer: "Contest creators review all submissions after the deadline and select winners based on the contest criteria. The selection process is transparent and fair."
      }
    ],
    "contests": [
      {
        question: "How do I participate in a contest?",
        answer: "Find a contest you're interested in, read the requirements carefully, pay the participation fee, and submit your entry before the deadline. Make sure to follow all guidelines for the best chance of winning."
      },
      {
        question: "Can I submit multiple entries?",
        answer: "Each contest has its own rules regarding multiple submissions. Check the contest details to see if multiple entries are allowed."
      },
      {
        question: "What happens after I submit my entry?",
        answer: "After submission, your entry will be reviewed by the contest creator after the deadline. Winners are typically announced within a few days of the contest ending."
      },
      {
        question: "Can I edit my submission after submitting?",
        answer: "Once submitted, entries cannot be modified. Make sure your submission is complete and meets all requirements before submitting."
      },
      {
        question: "How do I create my own contest?",
        answer: "Creators can create contests by going to their dashboard, clicking 'Create Contest', and filling out all required information including prize amount, deadline, and requirements."
      }
    ],
    "payments": [
      {
        question: "How do I receive my prize money?",
        answer: "Prize money is typically transferred to your account within 5-7 business days after being declared the winner. You'll receive an email notification when the transfer is complete."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
      },
      {
        question: "Are there any fees for receiving prizes?",
        answer: "ContestHub does not charge fees for receiving prize money. However, your payment provider (bank, PayPal, etc.) may have their own fees."
      },
      {
        question: "What if I don't win? Do I get my participation fee back?",
        answer: "Participation fees are non-refundable as they contribute to the prize pool and platform maintenance. However, you gain valuable experience and feedback."
      }
    ],
    "account": [
      {
        question: "How do I update my profile information?",
        answer: "Go to your Dashboard, click on 'My Profile', and you can update your name, photo, bio, and other information. Changes are saved automatically."
      },
      {
        question: "Can I change my email address?",
        answer: "Currently, email addresses cannot be changed after registration. If you need to change your email, please contact our support team."
      },
      {
        question: "How do I delete my account?",
        answer: "To delete your account, please contact our support team. Note that this action is irreversible and you'll lose all your contest history and achievements."
      },
      {
        question: "What are the different user roles?",
        answer: "There are three roles: Users (can participate in contests), Creators (can create and manage contests), and Admins (platform management). Contact support to upgrade your role."
      }
    ],
    "technical": [
      {
        question: "What file formats are accepted for submissions?",
        answer: "Accepted formats vary by contest type. Generally, we accept common formats like JPG, PNG, PDF, DOC, and provide links to external platforms for larger files."
      },
      {
        question: "I'm having trouble uploading my submission",
        answer: "Ensure your file meets the size and format requirements. Try refreshing the page or using a different browser. If issues persist, contact technical support."
      },
      {
        question: "The website is loading slowly",
        answer: "Try clearing your browser cache, disabling browser extensions, or switching to a different browser. If problems continue, it may be a temporary server issue."
      },
      {
        question: "I forgot my password",
        answer: "Click 'Forgot Password' on the login page and enter your email. You'll receive instructions to reset your password. If you don't receive the email, check your spam folder."
      }
    ]
  };

  const quickActions = [
    {
      title: "Browse Contests",
      description: "Explore available contests and find your next opportunity",
      link: "/all-contests",
      icon: "🎯"
    },
    {
      title: "View Leaderboard",
      description: "See top performers and track your ranking",
      link: "/leaderboard",
      icon: "🏆"
    },
    {
      title: "Create Account",
      description: "Join our community of creative professionals",
      link: "/register",
      icon: "👤"
    },
    {
      title: "Contact Support",
      description: "Get personalized help from our support team",
      link: "mailto:support@contesthub.com",
      icon: "📧"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
      {/* Header */}
      <div className=" text-black py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
            <span className="text-2xl">❓</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Find answers to common questions and get the help you need to succeed on ContestHub
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.link}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse through our most common questions organized by category
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                        activeCategory === category.id
                          ? "bg-red-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-3">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {categories.find(c => c.id === activeCategory)?.name} Questions
                </h3>
                
                <div className="space-y-4">
                  {faqs[activeCategory]?.map((faq, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <button
                        onClick={() => setOpenFaq(openFaq === `${activeCategory}-${index}` ? null : `${activeCategory}-${index}`)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </span>
                        <span className={`transform transition-transform ${
                          openFaq === `${activeCategory}-${index}` ? "rotate-180" : ""
                        }`}>
                          ▼
                        </span>
                      </button>
                      
                      {openFaq === `${activeCategory}-${index}` && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className=" text-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl text-gray-500 mb-8">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          <div className="space-x-4">
            <a
              href="mailto:support@contesthub.com"
              className="bg-white text-black px-8 py-3 rounded-lg
               font-medium hover:bg-gray-100 transition-colors inline-block"
            >
              Email Support
            </a>
            <a
              href="/about"
              className="border-2 border-white text-black
               px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors inline-block"
            >
              Learn More About Us
            </a>
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-bold mb-1">Email Support</h3>
              <p className="text-red-100 text-sm">support@contesthub.com</p>
            </div>
            <div>
              <div className="text-2xl mb-2">⏰</div>
              <h3 className="font-bold mb-1">Response Time</h3>
              <p className="text-red-100 text-sm">Within 24 hours</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-bold mb-1">Available</h3>
              <p className="text-red-100 text-sm">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}