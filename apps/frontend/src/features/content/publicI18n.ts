import type { Language } from "@app/providers/LanguageContext";
import { pageSeo, standardPages, thankYouMessages, type SeoContent, type StandardPageContent } from "./sitePages";

const englishSeo: Record<string, SeoContent> = {
  "/": {
    title: "Senova — An experiential lotus tea | by Calmora",
    description: "Senova is Calmora's experiential lotus tea project, connecting products, rituals and Vietnamese stories.",
  },
  "/about": {
    title: "About | Senova by Calmora",
    description: "Discover how Calmora developed Senova as an experiential lotus tea collection shaped by Keep — Open — Share.",
  },
  "/story": {
    title: "Our story | Senova by Calmora",
    description: "A lotus petal opens a Vietnamese story through Senova's Keep — Open — Share narrative.",
  },
  "/products": {
    title: "Products | Senova by Calmora",
    description: "Explore Senova Classic, Senova Petal Pack and Senova Gift Set in one lotus tea experience.",
  },
  "/ritual": {
    title: "Tea ritual | Senova by Calmora",
    description: "Open, sense, brew, wait and enjoy: Senova's guided lotus tea ritual.",
  },
  "/seasonal": {
    title: "Lotus season | Senova by Calmora",
    description: "Senova's seasonal space, where lotus fragrance, memory and stories meet.",
  },
  "/contact": {
    title: "Contact | Senova by Calmora",
    description: "Contact Calmora about Senova products, samples, events, distribution or brand partnerships.",
  },
  "/partners": {
    title: "Partnerships | Senova by Calmora",
    description: "Partner with Calmora on ingredients, production, distribution and Senova brand experiences.",
  },
  "/order-request": {
    title: "Preorder request | Senova by Calmora",
    description: "Choose a configuration and send a Senova preorder request for confirmation by email and Zalo within 1–2 business days.",
  },
  "/order-request/success": {
    title: "Request received | Senova by Calmora",
    description: "Senova has received your request and will contact you to confirm it before any bank transfer.",
    robots: "noindex,follow",
  },
  "/thank-you": {
    title: "Thank you | Senova by Calmora",
    description: "Thank you for contacting Senova.",
    robots: "noindex,follow",
  },
  "/privacy": {
    title: "Data policy | Senova by Calmora",
    description: "How Senova collects, uses and stores information submitted through its forms.",
  },
  "/terms": {
    title: "Terms of use | Senova by Calmora",
    description: "Terms for using the Senova product introduction and testing website.",
  },
  "/404": {
    title: "Page not found | Senova by Calmora",
    description: "The requested Senova page could not be found.",
    robots: "noindex,follow",
  },
};

export const publicSeo: Record<Language, Record<string, SeoContent>> = {
  vi: pageSeo,
  en: englishSeo,
};

const englishStandardPages: Record<string, StandardPageContent> = {
  "/ritual": {
    path: "/ritual",
    eyebrow: "Experiential ritual",
    title: "Open — sense — brew — wait — enjoy.",
    description: "A Senova sequence that draws attention to form, aroma, flavour and the time held for tea.",
    blocks: [
      { label: "01 / Observe", title: "Look before opening", text: "Notice the product's form, materials and packaging before beginning." },
      { label: "02 / Open", title: "Open gently, without rushing", text: "For Petal Pack, gently part the lotus petals to sense its shape and aroma, following the instructions for your product version." },
      { label: "03 / Sense", title: "Register the senses", text: "Notice the form, material and fragrance before pouring water." },
      { label: "04 / Brew", title: "Follow the package parameters", text: "Use the water volume and steeping time printed on your specific product version." },
      { label: "05 / Wait", title: "Let the flavour emerge", text: "Allow the lotus fragrance and tea flavour to settle before drinking." },
      { label: "06 / Enjoy", title: "Observe colour, aroma and taste", text: "Enjoy slowly, then share feedback to help Senova refine the product." },
    ],
    cta: {
      title: "Choose your way to enjoy tea",
      text: "Each product plays a different role in the shared Keep — Open — Share journey.",
      primary: { label: "View products", href: "/products" },
      secondary: { label: "Open the Petal Pack experience", href: "/experience/petal-pack" },
    },
    seo: englishSeo["/ritual"],
  },
  "/seasonal": {
    path: "/seasonal",
    eyebrow: "Lotus season",
    title: "Where fragrance, memory and stories meet.",
    description: "Senova's seasonal editorial space introduces cultural context without reducing places to decorative product labels.",
    blocks: [
      { label: "Context", title: "The season as a narrative rhythm", text: "Senova uses lotus season to expand stories of fragrance, memory and contemporary tea habits." },
      { label: "Editorial", title: "Symbols without absolutes", text: "Seasonal content is edited as cultural reference, avoiding historical claims or turning the lotus into mere decoration." },
      { label: "Application", title: "Editions for particular moments", text: "Gift Set and QR content can be adapted for a season, gifting occasion or event context." },
    ],
    cta: {
      title: "Bring lotus season into a specific experience",
      text: "If you are planning a seasonal event or gift, Senova can develop a fitting content direction with you.",
      primary: { label: "Discuss a partnership", href: "/partners" },
      secondary: { label: "View Gift Set", href: "/products/gift-set" },
    },
    seo: englishSeo["/seasonal"],
  },
  "/privacy": {
    path: "/privacy",
    eyebrow: "Data policy",
    title: "Data is collected to support your Senova experience.",
    description: "The website asks only for information needed for feedback, preorders, contact and partnerships.",
    blocks: [
      { title: "Types of data", text: "Forms may collect your name, email, phone number, products of interest, feedback and contact needs." },
      { title: "How data is used", text: "Data is used to answer requests, improve products, understand demand and plan product trials." },
      { title: "Storage and your requests", text: "You may request an update or deletion by contacting hello@senova.vn. Senova does not sell personal data." },
      { title: "Survey data", text: "Feedback may be used in aggregate; personal information is not published on the website." },
    ],
    seo: englishSeo["/privacy"],
  },
  "/terms": {
    path: "/terms",
    eyebrow: "Terms of use",
    title: "This website introduces and tests Senova products.",
    description: "Website information may change as products, content and operating plans evolve.",
    blocks: [
      { title: "Nature of the content", text: "Mockups and product descriptions do not necessarily represent the final commercial version." },
      { title: "Preorders", text: "A preorder request helps Senova measure demand and is not yet a payment transaction." },
      { title: "Brand assets", text: "Do not copy Senova by Calmora logos, images, content or brand assets without permission." },
      { title: "Third-party content", text: "The website may link to external sources; Senova is not responsible for content outside its operations." },
    ],
    seo: englishSeo["/terms"],
  },
};

export const localizedStandardPages: Record<Language, Record<string, StandardPageContent>> = {
  vi: standardPages,
  en: englishStandardPages,
};

export const localizedThankYouMessages: Record<Language, Record<string, { title: string; text: string }>> = {
  vi: thankYouMessages,
  en: {
    feedback: { title: "Thank you for your feedback.", text: "Your notes will help Senova improve future products and experiences." },
    "pre-order": { title: "Your request has been received.", text: "The Senova team will contact you when information is available for your selected product." },
    "sample-interest": { title: "Your sample interest has been received.", text: "Senova will aggregate anonymous Petal Pack / Gift Set feedback and contact you when a suitable sample session is available." },
    contact: { title: "Your message has been sent.", text: "The Senova team expects to reply within 1–3 business days." },
    partners: { title: "Your partnership proposal has been received.", text: "Calmora will review it and respond when there is a suitable direction to discuss." },
  },
};
