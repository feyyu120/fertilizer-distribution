import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "How do I register as a farmer?",
            a: "Click on 'Get Started' and fill out the registration form. Your account will be reviewed by our admin team before approval."
        },
        {
            q: "How long does delivery take?",
            a: "Delivery usually takes 1-3 days depending on your location in Oromia."
        },
        {
            q: "What payment methods are accepted?",
            a: "We currently accept TeleBirr, CBE Birr, and cash on delivery."
        },
        {
            q: "Can I track my order?",
            a: "Yes, once your order is approved, you can track it from your dashboard."
        },
        {
            q: "Is there a minimum order quantity?",
            a: "Minimum order is 50kg for most fertilizer types."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-16 transition-colors duration-300">
            {/* Header Section */}
            <div className="text-center mb-12">
                <p className="text-green-600 dark:text-green-500 font-semibold text-sm tracking-widest uppercase mb-3 transition-colors">
                    FAQ
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white leading-tight transition-colors">
                    Frequently Asked Questions
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto transition-colors">
                    Still unsure about ordering or delivery? We've gathered common answers to help you decide.
                </p>
            </div>

            {/* FAQ Cards */}
            <div className="flex flex-col gap-4">
                {faqs.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className={`bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden transition-all duration-300 ${
                                isOpen 
                                    ? 'border-green-500 shadow-lg shadow-green-500/10 dark:shadow-green-900/20' 
                                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                            }`}
                        >
                            {/* Question Row */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center gap-4 p-5 md:p-6 bg-transparent border-none cursor-pointer text-left focus:outline-none group"
                            >
                                {/* Icon */}
                                <div className={`w-10 h-10 min-w-[2.5rem] rounded-xl flex items-center justify-center transition-colors duration-300 ${
                                    isOpen 
                                        ? 'bg-green-100 dark:bg-green-900/30' 
                                        : 'bg-indigo-50 dark:bg-indigo-900/20 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40'
                                }`}>
                                    <HelpCircle
                                        size={20}
                                        className={`transition-colors duration-300 ${
                                            isOpen ? 'text-green-600 dark:text-green-500' : 'text-indigo-500 dark:text-indigo-400'
                                        }`}
                                    />
                                </div>

                                {/* Question Text */}
                                <span className="flex-1 font-semibold text-lg text-gray-900 dark:text-white transition-colors duration-300">
                                    {item.q}
                                </span>

                                {/* Toggle Icon */}
                                <div className={`w-8 h-8 min-w-[2rem] rounded-full border flex items-center justify-center transition-all duration-300 ${
                                    isOpen 
                                        ? 'border-green-500 rotate-180 bg-green-50 dark:bg-green-900/20' 
                                        : 'border-gray-300 dark:border-gray-700 group-hover:border-gray-400 dark:group-hover:border-gray-600'
                                }`}>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-colors duration-300 ${
                                            isOpen ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                    />
                                </div>
                            </button>

                            {/* Answer (collapsible) */}
                            <div 
                                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                                    isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="px-6 pb-6 pt-0 ml-14">
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base transition-colors duration-300">
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <p className="text-center text-gray-500 dark:text-gray-400 mt-12 text-base transition-colors duration-300">
                Still have questions? Visit our <Link to="/support" className="text-green-600 dark:text-green-500 font-medium hover:underline transition-colors">Support</Link> page.
            </p>
        </div>
    );
};

export default FAQ;