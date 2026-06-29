import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconSearch, 
  IconCalendar, 
  IconClock, 
  IconArrowRight, 
  IconLayoutGrid, 
  IconAdjustmentsHorizontal 
} from '@tabler/icons-react';
import { blogArticles } from '../Data/blogData';
import ScrollReveal from '../components/ScrollReveal';
import BorderBeam from '../components/BorderBeam';

export const BlogIndex = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories list derived from mock data
  const categories = ['All', 'AI Valuation', 'Online Bidding', 'Smart Build'];

  // Filtered articles based on search and category selections
  const filteredArticles = useMemo(() => {
    return blogArticles.filter(article => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Featured article is always the first one in the list (if no active filter)
  const featuredArticle = useMemo(() => {
    if (selectedCategory !== 'All' || searchQuery !== '') return null;
    return blogArticles[0];
  }, [selectedCategory, searchQuery]);

  // Remaining articles to render in grid
  const gridArticles = useMemo(() => {
    if (featuredArticle) {
      return filteredArticles.filter(a => a.id !== featuredArticle.id);
    }
    return filteredArticles;
  }, [filteredArticles, featuredArticle]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* ── RICH HERO HEADER ── */}
      <div className="bg-slate-950 text-white relative py-20 px-6 md:px-12 lg:px-20 overflow-hidden border-b border-slate-900">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto relative z-10 text-center space-y-6">
          <ScrollReveal direction="up" duration={0.8}>
            <span className="text-blue-500 font-extrabold uppercase text-xs tracking-widest bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
              PropSightAi Insights
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Editorial & Knowledge Hub
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Stay ahead of the curve. Dive deep into artificial intelligence pricing, virtual bidding mechanics, and modern construction guides compiled by engineers.
            </p>
          </ScrollReveal>

          {/* Search Box Panel */}
          <ScrollReveal direction="up" duration={0.8} delay={0.15}>
            <div className="max-w-xl mx-auto mt-8 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                <IconSearch size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, author, or keywords..."
                className="w-full pl-12 pr-6 py-4 bg-slate-900/60 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl text-sm placeholder-slate-500 transition-all outline-none text-slate-100 backdrop-blur-md shadow-lg"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── FILTER PANELS & DIRECTORY ── */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-12">
        
        {/* Category Tabs list */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6 mb-10">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-white px-4 py-2.5 rounded-xl border border-slate-200/85">
              <IconLayoutGrid size={15} />
              <span>Showing {filteredArticles.length} articles</span>
            </div>
          </div>
        </ScrollReveal>

        {/* ── SPOTLIGHT FEATURED ARTICLE ── */}
        {featuredArticle && (
          <ScrollReveal direction="up" duration={0.8} delay={0.1}>
            <div className="mb-14">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-4 block">
                ⭐ Featured Story
              </span>
              <Link 
                to={`/blog/${featuredArticle.id}`}
                className="relative overflow-hidden group grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 block"
              >
                {/* Border Beam accent */}
                <BorderBeam size={220} duration={8} borderWidth={1.5} delay={0} />

                {/* Left Column: Big Image */}
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100 min-h-[320px] relative">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-6 left-6 bg-slate-900/90 text-blue-400 text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider border border-slate-800">
                    {featuredArticle.category}
                  </div>
                </div>

                {/* Right Column: Context details */}
                <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <IconCalendar size={14} />
                        {featuredArticle.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <IconClock size={14} />
                        {featuredArticle.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-black flex items-center justify-center text-sm shadow-inner">
                        {featuredArticle.authorAvatar}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">{featuredArticle.author}</span>
                        <span className="text-[10px] text-slate-500 block font-medium">{featuredArticle.authorRole}</span>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-150">
                      <IconArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        )}

        {/* ── OTHER ARTICLES GRID ── */}
        {gridArticles.length > 0 ? (
          <div>
            {featuredArticle && (
              <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">
                More Articles & Resources
              </h3>
            )}
            
            <ScrollReveal 
              cascade={true} 
              direction="up" 
              staggerAmount={0.08} 
              duration={0.7}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {gridArticles.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="relative overflow-hidden group flex flex-col bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 block h-full cursor-pointer"
                >
                  {/* Border Beam Loop */}
                  <BorderBeam size={130} duration={8} borderWidth={1.5} delay={0} />

                  {/* Cover image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 text-blue-600 text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider border border-slate-100">
                      {post.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2.5">
                        <IconCalendar size={13} />
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-slate-500 text-xs md:text-sm mt-2.5 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xs shadow-inner">
                          {post.authorAvatar}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{post.author}</span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-550 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-100 shrink-0">
                        <IconArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </ScrollReveal>
          </div>
        ) : (
          /* Empty Search results State */
          <ScrollReveal direction="up" duration={0.6}>
            <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl max-w-xl mx-auto shadow-inner p-8">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100">
                <IconAdjustmentsHorizontal size={30} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">No articles found</h3>
              <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                We couldn't find any articles matching your search query "{searchQuery}". Try using different keywords or checking another category.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
              >
                Reset Search Filters
              </button>
            </div>
          </ScrollReveal>
        )}

      </div>
    </div>
  );
};

export default BlogIndex;
