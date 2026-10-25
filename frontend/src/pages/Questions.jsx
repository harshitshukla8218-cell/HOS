import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Mail } from 'lucide-react';

const questionGroups = [
    {
        title: 'House of Simons',
        questions: [
            {
                question: 'Why choose House of Simons?',
                answer: (
                    <p>
                        House of Simons creates contemporary styles for women who value individuality and effortless elegance. Each style has its own fit and sizing guidance, and our team can help with measurements before you place an order.
                    </p>
                ),
            },
            {
                question: 'How can your team help me?',
                answer: (
                    <p>
                        We can answer questions about a garment&apos;s measurements, fit, styling, and available customisation. Email us at{' '}
                        <a className="font-medium text-luxury-charcoal underline" href="mailto:online@houseofsimons.com">online@houseofsimons.com</a>{' '}
                        before purchasing and include the product name or link so we can assist with the specific style.
                    </p>
                ),
            },
        ],
    },
    {
        title: 'Sizing & Orders',
        questions: [
            {
                question: 'How do I choose the right size?',
                answer: (
                    <p>
                        Our sizing is style-specific and caters to body measurements corresponding to UK sizes 6 to 18. Some styles are free size, one size fits all, max plus size, or customisable. Please read the size instructions on the product page; contact us for measurement help before ordering. Visit our <Link className="font-medium text-luxury-charcoal underline" to="/about?tab=sizing">sizing guide</Link> for more information.
                    </p>
                ),
            },
            {
                question: 'Can I request a customised fit?',
                answer: (
                    <p>
                        Some styles can be customised. Availability depends on the garment, so please email us about the specific style and requested adjustment before placing your order.
                    </p>
                ),
            },
            {
                question: 'How long does shipping take?',
                answer: (
                    <p>
                        Domestic orders generally arrive in 3–5 working days. Complimentary express courier delivery is available across India on orders above ₹15,000. International express delivery is listed as 7–10 working days. Delivery estimates may vary by destination.
                    </p>
                ),
            },
        ],
    },
    {
        title: 'Exchanges & Returns',
        questions: [
            {
                question: 'Can I exchange or return an item?',
                answer: (
                    <p>
                        Only domestic orders are eligible. Email your request within 2 days of receiving your item and wait for our acceptance before shipping it back. Items must be unused and undamaged, with original tags and protective packaging, and must reach us within 5 days of starting the process. Some limited-edition items are not eligible; this will be stated on the product page. Read the full <Link className="font-medium text-luxury-charcoal underline" to="/about?tab=returns">exchange and returns policy</Link> before making a request.
                    </p>
                ),
            },
            {
                question: 'Who pays for exchange shipping, and when will I receive my exchange?',
                answer: (
                    <p>
                        Exchange shipping is paid by the customer. We aim to ship an accepted exchange within 7 working days after receiving the returned item. If the exchange item costs more, we will ask you to pay the difference; if it costs less, the applicable exchange shipping fee and item value are deducted before refunding the balance. Exchanged items cannot be exchanged or returned again.
                    </p>
                ),
            },
            {
                question: 'When will a return refund be issued?',
                answer: (
                    <p>
                        For an eligible return, we will send your refund within 2 working days of receiving the returned item. The original shipping fee is not refundable. Overseas orders cannot be returned or exchanged.
                    </p>
                ),
            },
        ],
    },
    {
        title: 'Feedback & Support',
        questions: [
            {
                question: 'How can I share feedback or a service concern?',
                answer: (
                    <p>
                        We welcome your feedback. Email{' '}
                        <a className="font-medium text-luxury-charcoal underline" href="mailto:online@houseofsimons.com?subject=Feedback%20for%20House%20of%20Simons">online@houseofsimons.com</a>{' '}
                        with the subject “Feedback” and include your order number if your message relates to an order.
                    </p>
                ),
            },
            {
                question: 'When is the store closed?',
                answer: <p>Our store is closed on Sundays.</p>,
            },
        ],
    },
];

export default function Questions() {
    return (
        <div className="min-h-screen bg-atelier-seafoam/50 font-sans text-luxury-charcoal">
            <section className="bg-luxury-nearblack px-4 py-16 text-luxury-ivory md:py-20">
                <div className="mx-auto max-w-4xl space-y-4 text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-luxury-champagne md:text-xs">
                        HOUSE OF SIMONS CLIENT CARE
                    </span>
                    <h1 className="editorial-title-md font-normal uppercase text-white">Questions</h1>
                    <p className="mx-auto max-w-xl text-xs font-light leading-relaxed text-white/65 md:text-sm">
                        Helpful information about our collections, fit, service, and order policies.
                    </p>
                </div>
            </section>

            <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 md:grid-cols-[220px_minmax(0,1fr)] md:gap-20 md:px-8 md:py-16">
                <aside className="space-y-3 md:sticky md:top-28 md:self-start">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-luxury-muted">Browse topics</p>
                    <nav aria-label="Question topics" className="flex flex-wrap gap-x-5 gap-y-2 md:flex-col md:gap-3">
                        {questionGroups.map((group) => (
                            <a key={group.title} href={`#${group.title.toLowerCase().replaceAll(' ', '-')}`} className="text-xs text-luxury-charcoal/75 underline-offset-4 hover:text-luxury-champagne hover:underline">
                                {group.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                <main className="space-y-12">
                    {questionGroups.map((group) => (
                        <section key={group.title} id={group.title.toLowerCase().replaceAll(' ', '-')} className="scroll-mt-28">
                            <h2 className="mb-2 font-serif text-xl uppercase text-luxury-charcoal">{group.title}</h2>
                            <div className="border-t border-luxury-charcoal/15">
                                {group.questions.map(({ question, answer }) => (
                                    <details key={question} className="group border-b border-luxury-charcoal/15">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-medium text-luxury-charcoal marker:content-none">
                                            <span>{question}</span>
                                            <ChevronDown aria-hidden="true" size={16} className="flex-none text-luxury-champagne transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="max-w-2xl pb-5 pr-8 text-xs font-light leading-relaxed text-luxury-muted md:text-sm">
                                            {answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    ))}

                    <div className="flex flex-col gap-3 border-t border-luxury-charcoal/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-luxury-muted">Still have a question? Our team is happy to help.</p>
                        <a href="mailto:online@houseofsimons.com" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-luxury-charcoal underline underline-offset-4 hover:text-luxury-champagne">
                            <Mail size={14} aria-hidden="true" />
                            Email Client Care
                        </a>
                    </div>
                </main>
            </div>
        </div>
    );
}