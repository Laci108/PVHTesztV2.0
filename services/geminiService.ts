
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse, Language } from "../types";

// Simulated dataset for testing/fallback
const MOCK_DATA: Record<Language, RecommendationResponse> = {
  hu: {
    summary: "Pécs szívében, a Király utca környékén találtam 3 olyan üzlethelyiséget, amely tökéletes lenne egy kézműves kávézó számára. Mindhárom ingatlan nagy üvegfelülettel és jelentős gyalogos forgalommal rendelkezik.",
    suggestions: [
      {
        id: "1",
        title: "Király utcai 'Art Deco' Üzlet",
        price: "240.000 Ft/hó",
        location: "Pécs, Király u. 12.",
        description: "65 m2-es, polgári stílusú üzlethelyiség, hatalmas boltíves ablakokkal.",
        link: "https://ingatlanok.pvh.hu/pvh123",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
        reason: "A Király utca legforgalmasabb részén van, a kávézó terasza is megoldható.",
        tags: ["BELVÁROS", "TERASZ LEHETŐSÉG"],
        pros: ["Kiemelt lokáció", "Nagy belmagasság", "Frissen festett"],
        cons: ["Kevés raktárhelyiség", "Zajos környezet"],
        auctionInfo: { deadline: "2025.04.15", type: "licit", deposit: "500.000 Ft" }
      },
      {
        id: "2",
        title: "Modern Irodaház - Zsolnay Negyed",
        price: "180.000 Ft/hó",
        location: "Pécs, Zsolnay út 4.",
        description: "45 m2-es, légkondicionált iroda, közös teakonyhával.",
        link: "https://ingatlanok.pvh.hu/pvh456",
        imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80",
        reason: "Csendes, modern környezet, ideális kreatív munkához.",
        tags: ["KLÍMA", "PARKOLÓ"],
        pros: ["Alacsony rezsi", "Portaszolgálat", "Ingyen parkolás"],
        cons: ["Távolabb a központtól"],
        auctionInfo: { deadline: "2025.05.01", type: "fix", deposit: "0 Ft" }
      }
    ],
    sources: []
  },
  en: {
    summary: "I found 2 premium properties in Pécs that match your requirements for a modern office space with good accessibility.",
    suggestions: [
      {
        id: "1",
        title: "Király Street Art Office",
        price: "€650/month",
        location: "Pécs, Király str. 12.",
        description: "65 sqm classic office space with large arched windows.",
        link: "https://ingatlanok.pvh.hu/pvh123",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
        reason: "Located in the heart of the pedestrian zone, perfect for representative offices.",
        tags: ["DOWNTOWN", "HISTORIC"],
        pros: ["Prime location", "High ceiling", "Recently renovated"],
        cons: ["Limited storage", "Busy area"],
        auctionInfo: { deadline: "2025.04.15", type: "licit", deposit: "€1500" }
      }
    ],
    sources: []
  },
  de: {
    summary: "Ich habe 2 erstklassige Immobilien in Pécs gefunden, die Ihren Anforderungen an moderne Büroflächen mit guter Erreichbarkeit entsprechen.",
    suggestions: [],
    sources: []
  }
};

export const getPropertyRecommendations = async (userQuery: string, lang: Language = 'hu'): Promise<RecommendationResponse> => {
  // Check if we should use mock data for testing or when query is very simple
  if (userQuery.toLowerCase() === 'test' || userQuery.toLowerCase() === 'teszt') {
    return MOCK_DATA[lang];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Te vagy a Pécsi Vagyonkezelő (PVH) intelligens ingatlan asszisztense.
    Válaszolj a felhasználó nyelvén (${lang}). 
    
    A feladatod:
    1. Keresd meg a https://ingatlanok.pvh.hu/kiado-ingatlanok/ oldalon a legmegfelelőbb ingatlanokat.
    2. Adj meg pontos indoklást, hogy miért pont ezeket ajánlod.
    3. Ha találsz licit/pályázat adatot (határidő, biztosíték), mindenképp töltsd ki az auctionInfo részt.
    4. Ha nincs találat, küldj vissza üres suggestions listát.
    
    Minden válasz érvényes JSON legyen.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Query in ${lang}: "${userQuery}". Analyze PVH properties and respond in JSON.`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  price: { type: Type.STRING },
                  location: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                  imageUrl: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                  auctionInfo: {
                    type: Type.OBJECT,
                    properties: {
                      deadline: { type: Type.STRING },
                      type: { type: Type.STRING },
                      deposit: { type: Type.STRING }
                    }
                  }
                },
                required: ["title", "link", "reason", "description", "pros", "cons"]
              }
            }
          },
          required: ["summary", "suggestions"]
        }
      },
    });

    const result = JSON.parse(response.text || "{}") as RecommendationResponse;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri || ""
    })).filter((s: any) => s.uri) || [];

    return { ...result, sources };
  } catch (error) {
    console.warn("API Error, using mock data for demo", error);
    return MOCK_DATA[lang];
  }
};
