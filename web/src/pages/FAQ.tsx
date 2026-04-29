import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <p style={{
                    color: '#22c55e',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem'
                }}>
                    FAQ
                </p>
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    lineHeight: 1.2
                }}>
                    Frequently Asked Questions
                </h1>
                <p style={{ color: '#9ca3af', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                    Still unsure about ordering or delivery? We've gathered common answers to help you decide.
                </p>
            </div>

            {/* FAQ Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqs.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            style={{
                                background: '#111827',
                                borderRadius: '1rem',
                                border: `1px solid ${isOpen ? '#22c55e33' : '#1f2937'}`,
                                overflow: 'hidden',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                boxShadow: isOpen ? '0 0 20px rgba(34, 197, 94, 0.05)' : 'none',
                            }}
                        >
                            {/* Question Row */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1.25rem 1.5rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'white',
                                    textAlign: 'left',
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    minWidth: '2.5rem',
                                    borderRadius: '0.75rem',
                                    background: isOpen ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background 0.3s ease',
                                }}>
                                    <HelpCircle
                                        size={18}
                                        style={{
                                            color: isOpen ? '#22c55e' : '#818cf8',
                                            transition: 'color 0.3s ease'
                                        }}
                                    />
                                </div>

                                {/* Question Text */}
                                <span style={{
                                    flex: 1,
                                    fontWeight: 600,
                                    fontSize: '1.05rem',
                                    lineHeight: 1.5,
                                }}>
                                    {item.q}
                                </span>

                                {/* Toggle Icon */}
                                <div style={{
                                    width: '2rem',
                                    height: '2rem',
                                    minWidth: '2rem',
                                    borderRadius: '50%',
                                    border: '1px solid #374151',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    borderColor: isOpen ? '#22c55e' : '#374151',
                                }}>
                                    <ChevronDown
                                        size={16}
                                        style={{
                                            color: isOpen ? '#22c55e' : '#6b7280',
                                            transition: 'color 0.3s ease'
                                        }}
                                    />
                                </div>
                            </button>

                            {/* Answer (collapsible) */}
                            <div style={{
                                maxHeight: isOpen ? '300px' : '0px',
                                overflow: 'hidden',
                                transition: 'max-height 0.4s ease, padding 0.3s ease',
                                padding: isOpen ? '0 1.5rem 1.5rem 5rem' : '0 1.5rem 0 5rem',
                            }}>
                                <p style={{
                                    color: '#9ca3af',
                                    lineHeight: 1.8,
                                    fontSize: '0.975rem',
                                }}>
                                    {item.a}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '3rem', fontSize: '0.95rem' }}>
                Still have questions? Visit our <span style={{ color: '#22c55e', fontWeight: 500 }}>Support</span> page.
            </p>
        </div>
    );
};

export default FAQ;