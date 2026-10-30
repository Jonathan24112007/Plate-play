export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "is-restaurant",
    question: "Is PlatePlay a restaurant?",
    answer:
      "No. PlatePlay is a planned interactive cooking experience where groups prepare their own meals together in a fully equipped private kitchen. Instead of just ordering food off a menu, you and your group create the meal from scratch.",
    category: "The Concept",
  },
  {
    id: "experience-needed",
    question: "Do I need cooking experience?",
    answer:
      "No. Our experiences (especially PLAY) are designed to be beginner-friendly, fun, and accessible to everyone. Ingredients are pre-measured, instructions are intuitive, and culinary guidance and safety supervision are always on hand.",
    category: "Experience",
  },
  {
    id: "private-kitchen",
    question: "Will we share a kitchen with strangers?",
    answer:
      "Never. The core philosophy of PlatePlay is: One booking = One private kitchen = One group. Your kitchen space belongs exclusively to you and your companions for the entire duration of your session.",
    category: "The Concept",
  },
  {
    id: "choose-dishes",
    question: "Can I choose what to cook?",
    answer:
      "Yes. The level of customization depends on the experience selected: In PLAY, you choose from a curated selection of crowd-favourite dishes. In CREATE, you customize ingredients and flavour profiles. In UNLEASH, you can bring your own custom recipe after prior review.",
    category: "Experience",
  },
  {
    id: "dietary-needs",
    question: "What if I have dietary requirements?",
    answer:
      "Dietary needs and allergies are collected in advance during your booking preference setup. All requests are subject to safe preparation, cross-contamination prevention, and culinary feasibility.",
    category: "Operations",
  },
  {
    id: "book-now",
    question: "Can I book right now?",
    answer:
      "PlatePlay is currently preparing its pilot phase. Bookings are not open yet, but joining our early-access waitlist gives you priority access to pilot announcements, preview slots, and exclusive community tastings.",
    category: "Bookings",
  },
  {
    id: "location",
    question: "Where is PlatePlay located?",
    answer:
      "The first pilot location has not yet been officially announced. We will announce the inaugural pilot city and neighbourhood directly to our waitlist members first.",
    category: "Locations",
  },
];

