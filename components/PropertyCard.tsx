
import React, { useState } from 'react';
import { PropertySuggestion, Language, UI_LABELS } from '../types';

interface PropertyCardProps {
  property: PropertySuggestion;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  lang: Language;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isFavorite, onToggleFavorite, lang }) => {
  const [imgError, setImgError] = useState(false);
  const t = UI_LABELS[lang];

  const getFallbackImageUrl = () => {
    const title = property.title.toLowerCase();
    if (title.includes('iroda')) return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';
    if (title.includes('üzlet') || title.includes('bolt')) return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
  };

  const currentImageUrl = (!imgError && property.imageUrl) ? property.imageUrl : getFallbackImageUrl();

  return (
    <div className="group bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative">
      {/* Auction Badge */}
      {property.auctionInfo && property.auctionInfo.type !== 'fix' && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            {t.auction}: {property.auctionInfo.type.toUpperCase()}
          </div>
        </div>
      )}

      <div className="relative h-60 overflow-hidden bg-slate-100">
        <img 
          src={currentImageUrl} 
          alt={property.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => onToggleFavorite(property.link)}
            className={`p-3 rounded-2xl backdrop-blur-md shadow-xl transition-all ${isFavorite ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-500 hover:text-emerald-600'}`}
          >
            <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-emerald-700 transition-colors h-14 overflow-hidden">
            {property.title}
          </h3>
          <div className="text-emerald-800 font-black text-lg bg-emerald-50 inline-flex px-3 py-1 rounded-xl">
            {property.price}
          </div>
        </div>
        
        <p className="text-slate-500 text-xs font-bold mb-6 flex items-center">
          <svg className="w-4 h-4 mr-1.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {property.location}
        </p>

        {/* Auction Info Panel */}
        {property.auctionInfo && (
          <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.deadline}</span>
              <p className="text-xs font-bold text-slate-900">{property.auctionInfo.deadline}</p>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.deposit}</span>
              <p className="text-xs font-bold text-slate-900">{property.auctionInfo.deposit}</p>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6 flex-grow">
          <div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block mb-2">{t.pros}</span>
            <div className="flex flex-wrap gap-1">
              {property.pros.slice(0, 2).map((pro, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">✓ {pro}</span>
              ))}
            </div>
          </div>
          
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
             <span className="text-[10px] font-black text-emerald-800 uppercase block mb-1">✨ {t.expertTipp}</span>
             <p className="text-[11px] text-slate-700 leading-relaxed italic">
               "{property.reason}"
             </p>
          </div>
        </div>

        <a 
          href={property.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full text-center bg-emerald-800 text-white py-4 rounded-2xl text-sm font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/10"
        >
          {lang === 'hu' ? 'Megnézem' : lang === 'en' ? 'View Details' : 'Details ansehen'}
        </a>
      </div>
    </div>
  );
};

export default PropertyCard;
