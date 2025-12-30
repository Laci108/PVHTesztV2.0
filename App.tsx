
import React, { useState, useEffect, useMemo } from 'react';
import { getPropertyRecommendations } from './services/geminiService';
import { RecommendationResponse, PropertySuggestion, Language, UI_LABELS } from './types';
import PropertyCard from './components/PropertyCard';

const CATEGORIES = {
  hu: [
    { id: 'iroda', label: 'Irodák', icon: '🏢', query: 'Keresd meg a legjobb irodákat.' },
    { id: 'uzlet', label: 'Üzletek', icon: '🛒', query: 'Utcafronti üzleteket keresek.' },
  ],
  en: [
    { id: 'iroda', label: 'Offices', icon: '🏢', query: 'Find the best offices in Pécs.' },
    { id: 'uzlet', label: 'Shops', icon: '🛒', query: 'Looking for street-front shops.' },
  ],
  de: [
    { id: 'iroda', label: 'Büros', icon: '🏢', query: 'Finden Sie die besten Büros.' },
    { id: 'uzlet', label: 'Läden', icon: '🛒', query: 'Ich suche Ladenlokale.' },
  ]
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('hu');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const t = UI_LABELS[lang];

  useEffect(() => {
    const saved = localStorage.getItem('pvh_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('pvh_favorites', JSON.stringify(newFavs));
  };

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setLoading(true);
    setError(null);
    setShowFavoritesOnly(false);
    try {
      const result = await getPropertyRecommendations(searchQuery, lang);
      setData(result);
      if (result.suggestions.length === 0) {
        setShowLeadForm(true);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba.');
    } finally {
      setLoading(false);
    }
  };

  const displayProperties = useMemo(() => {
    if (!data) return [];
    if (showFavoritesOnly) return data.suggestions.filter(p => favorites.includes(p.link));
    return data.suggestions;
  }, [data, showFavoritesOnly, favorites]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-2xl border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center text-white font-black shadow-xl">P</div>
            <h1 className="text-xl font-black text-slate-900 leading-none">PVH <span className="text-emerald-700 underline decoration-emerald-200 decoration-4">Property</span></h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
              {(['hu', 'en', 'de'] as Language[]).map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-white shadow-sm text-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${showFavoritesOnly ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-800'}`}
            >
              <svg className="w-4 h-4" fill={showFavoritesOnly ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="hidden sm:inline">{t.favorites} ({favorites.length})</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 md:py-20">
        {/* Hero */}
        {!data && !loading && (
          <section className="text-center mb-16 space-y-6 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tighter">
              {t.heroTitle}
            </h2>
            <p className="text-xl text-slate-500 font-medium">
              {t.heroSub}
            </p>
          </section>
        )}

        {/* Search Bar */}
        <section className={`max-w-4xl mx-auto mb-16 transition-all duration-700 ${data ? 'scale-90 -mt-10' : ''}`}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-44 py-7 bg-white border-2 border-slate-200 rounded-[2rem] shadow-2xl focus:border-emerald-600 outline-none transition-all text-xl font-semibold"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 px-10 bg-emerald-800 text-white rounded-[1.5rem] font-black hover:bg-emerald-700 flex items-center shadow-xl active:scale-95 transition-all"
            >
              {loading ? t.loading : t.searchBtn}
            </button>
          </form>

          {!data && (
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {CATEGORIES[lang].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSearch(cat.query)}
                  className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-black text-slate-600 hover:border-emerald-500 hover:text-emerald-800 transition-all flex items-center gap-3"
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Results */}
        {loading && (
          <div className="text-center py-20 animate-pulse">
            <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-emerald-800 font-black">{t.loading}</p>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-12">
            {/* Licit Assistant Sidebar (Floating concept for mobile/desktop) */}
            <div className="bg-emerald-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10">
               <div className="md:w-2/3">
                  <h3 className="text-emerald-300 text-xs font-black uppercase tracking-widest mb-4">AI Analysis</h3>
                  <p className="text-3xl font-medium leading-tight">{data.summary}</p>
               </div>
               <div className="md:w-1/3 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                  <h4 className="font-black mb-4 flex items-center gap-2"><span className="text-xl">🎓</span> {t.licitHelpTitle}</h4>
                  <ul className="text-xs space-y-3 opacity-90 font-bold">
                    <li>{t.licitHelpStep1}</li>
                    <li>{t.licitHelpStep2}</li>
                    <li>{t.licitHelpStep3}</li>
                  </ul>
               </div>
            </div>

            {/* Empty State / Lead Gen Form */}
            {data.suggestions.length === 0 && showLeadForm && (
              <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200 text-center animate-in fade-in duration-1000">
                <span className="text-6xl mb-6 block">📫</span>
                <h3 className="text-2xl font-black mb-2">{t.noResultsTitle}</h3>
                <p className="text-slate-500 font-medium mb-8">{t.noResultsSub}</p>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Köszönjük! Értesíteni fogjuk.'); setShowLeadForm(false); }}>
                  <input type="email" required placeholder="E-mail cím..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                  <button type="submit" className="w-full bg-emerald-800 text-white py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg">{t.notifyMe}</button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayProperties.map((property, idx) => (
                <PropertyCard 
                  key={idx} 
                  property={property} 
                  isFavorite={favorites.includes(property.link)}
                  onToggleFavorite={toggleFavorite}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-500 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">Pécsi Vagyonkezelő NZrt.</p>
          <div className="flex justify-center space-x-6 text-xs font-bold">
            <a href="https://pvh.hu" className="hover:text-white">pvh.hu</a>
            <a href="#" className="hover:text-white">Impresszum</a>
            <a href="#" className="hover:text-white">Adatvédelem</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
