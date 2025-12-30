
export interface PropertySuggestion {
  id: string;
  title: string;
  price: string;
  location: string;
  description: string;
  link: string;
  imageUrl?: string;
  reason: string;
  tags?: string[];
  pros: string[];
  cons: string[];
  auctionInfo?: {
    deadline: string;
    type: 'licit' | 'palyazat' | 'fix';
    deposit: string;
  };
}

export interface RecommendationResponse {
  suggestions: PropertySuggestion[];
  summary: string;
  sources: { title: string; uri: string }[];
}

export type Language = 'hu' | 'en' | 'de';

export const UI_LABELS: Record<Language, any> = {
  hu: {
    heroTitle: "Pécs belvárosában indítaná üzletét?",
    heroSub: "A Pécsi Vagyonkezelő bérleti kínálata mostantól mesterséges intelligenciával is böngészhető.",
    searchPlaceholder: "Írja le igényeit...",
    searchBtn: "Ajánlatok kérése",
    loading: "Elemzés...",
    favorites: "Mentett",
    pros: "Előnyök",
    cons: "Mérlegelendő",
    auction: "Licit/Pályázat",
    deadline: "Határidő",
    deposit: "Biztosíték",
    noResultsTitle: "Nem találtunk pontos egyezést.",
    noResultsSub: "Ne maradjon le! Szólunk, ha megjelenik az igényeinek megfelelő ingatlan.",
    notifyMe: "Értesítőt kérek",
    expertTipp: "Szakértőnk szerint",
    licitHelpTitle: "Hogyan működik a licit?",
    licitHelpStep1: "1. Regisztráció és biztosíték befizetése.",
    licitHelpStep2: "2. Pályázat benyújtása zárt borítékban.",
    licitHelpStep3: "3. Nyilvános licit az irodánkban.",
  },
  en: {
    heroTitle: "Starting a business in Pécs?",
    heroSub: "The property portfolio of Pécs Asset Management is now browsable with AI assistance.",
    searchPlaceholder: "Describe your needs...",
    searchBtn: "Get Offers",
    loading: "Analyzing...",
    favorites: "Saved",
    pros: "Pros",
    cons: "Cons",
    auction: "Auction/Tender",
    deadline: "Deadline",
    deposit: "Deposit",
    noResultsTitle: "No exact matches found.",
    noResultsSub: "Don't miss out! We'll notify you when a matching property becomes available.",
    notifyMe: "Notify Me",
    expertTipp: "Expert Opinion",
    licitHelpTitle: "How does the auction work?",
    licitHelpStep1: "1. Registration and deposit payment.",
    licitHelpStep2: "2. Submit bid in a sealed envelope.",
    licitHelpStep3: "3. Public auction at our office.",
  },
  de: {
    heroTitle: "Geschäftseröffnung in Pécs?",
    heroSub: "Das Immobilienportfolio der PVH ist jetzt mit KI-Unterstützung durchsuchbar.",
    searchPlaceholder: "Beschreiben Sie Ihre Wünsche...",
    searchBtn: "Angebote erhalten",
    loading: "Analyse...",
    favorites: "Gespeichert",
    pros: "Vorteile",
    cons: "Zu beachten",
    auction: "Auktion/Ausschreibung",
    deadline: "Frist",
    deposit: "Kaution",
    noResultsTitle: "Keine genauen Treffer gefunden.",
    noResultsSub: "Verpassen Sie nichts! Wir benachrichtigen Sie, wenn ein passendes Objekt verfügbar wird.",
    notifyMe: "Benachrichtigen",
    expertTipp: "Expertenmeinung",
    licitHelpTitle: "Wie funktioniert die Auktion?",
    licitHelpStep1: "1. Registrierung und Kautionszahlung.",
    licitHelpStep2: "2. Gebot in verschlossenem Umschlag einreichen.",
    licitHelpStep3: "3. Öffentliche Auktion in unserem Büro.",
  }
};
