import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  IconArrowLeft, 
  IconCalendar, 
  IconClock, 
  IconShare, 
  IconLink,
  IconBrandWhatsapp,
  IconBrandTwitter,
  IconCheck
} from '@tabler/icons-react';
import { getArticleById, getRelatedArticles } from '../Data/blogData';
import ScrollReveal from '../components/ScrollReveal';
import BorderBeam from '../components/BorderBeam';

export const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const article = getArticleById(id);

  // Smooth scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Back-to-top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 p-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Article Not Found</h2>
        <p className="text-slate-550 text-sm mt-1 mb-6">The article you are looking for does not exist or has been archived.</p>
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <IconArrowLeft size={16} /> Back to Blog
        </button>
      </div>
    );
  }

  const relatedArticles = getRelatedArticles(article.id, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      
      {/* ── TOP READING PROGRESS BAR ── */}
      <div className="fixed top-0 left-0 w-full h-[3.5px] bg-slate-100 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── ARTICLE CONTAINER ── */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        
        {/* Navigation Breadcrumb Back link */}
        <div className="mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs transition duration-200"
          >
            <IconArrowLeft size={15} /> Back to Editorial Hub
          </Link>
        </div>

        {/* ── ARTICLE HEADER SECTION ── */}
        <ScrollReveal direction="up" duration={0.8}>
          <div className="space-y-5">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50/60 px-3.5 py-1.5 rounded-full border border-blue-100">
              {article.category}
            </span>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight pt-2">
              {article.title}
            </h1>

            {/* Author profile & publication data */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 font-black flex items-center justify-center text-sm shadow-inner">
                  {article.authorAvatar}
                </div>
                <div>
                  <span className="text-sm font-black text-slate-900 block">{article.author}</span>
                  <span className="text-[11px] text-slate-500 block font-medium">{article.authorRole}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  <IconCalendar size={14} />
                  {article.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <IconClock size={14} />
                  {article.readTime}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── MAIN HERO COVER IMAGE ── */}
        <ScrollReveal direction="up" duration={0.8} delay={0.1}>
          <div className="my-8 rounded-3xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-150 shadow-lg">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>

        {/* ── GRID BLOCK: ARTICLE CONTENT + FLOATING SHARE BAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* LEFT COLUMN: Floating social shares (Visible on large screens) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 flex flex-col items-center gap-4">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider vertical-text mb-2">Share</span>
              
              <button 
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-blue-600 text-slate-500 hover:text-blue-600 flex items-center justify-center bg-white transition shadow-sm hover:shadow-md cursor-pointer"
                title="Copy Article Link"
              >
                {copied ? <IconCheck size={18} className="text-emerald-500" /> : <IconLink size={18} />}
              </button>

              <a 
                href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-emerald-600 text-slate-500 hover:text-emerald-600 flex items-center justify-center bg-white transition shadow-sm hover:shadow-md cursor-pointer"
                title="Share on WhatsApp"
              >
                <IconBrandWhatsapp size={18} />
              </a>

              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-sky-650 text-slate-500 hover:text-sky-600 flex items-center justify-center bg-white transition shadow-sm hover:shadow-md cursor-pointer"
                title="Share on Twitter"
              >
                <IconBrandTwitter size={18} />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Content Text Body */}
          <div className="lg:col-span-11 space-y-6">
            <ScrollReveal direction="up" duration={0.8} delay={0.15}>
              <div 
                className="prose max-w-none text-slate-700 leading-relaxed font-normal"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </ScrollReveal>

            {/* Mobile share row */}
            <div className="flex lg:hidden flex-wrap items-center gap-3 pt-6 border-t border-slate-100 mt-8">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Share Story:</span>
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 bg-slate-50 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition"
              >
                {copied ? <><IconCheck size={14} className="text-emerald-500" /> Copied!</> : <><IconLink size={14} /> Copy Link</>}
              </button>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 bg-slate-50 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition"
              >
                <IconBrandWhatsapp size={14} className="text-emerald-500" /> WhatsApp
              </a>
            </div>
            
            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100 mt-8">
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-bold px-3.5 py-1.5 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* ── RELATED READING ── */}
            {relatedArticles.length > 0 && (
              <div className="pt-12 mt-12 border-t border-slate-100 space-y-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Related Insights
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="relative overflow-hidden group flex flex-col bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 block h-full cursor-pointer"
                    >
                      {/* Border Beam Animation */}
                      <BorderBeam size={100} duration={8} borderWidth={1.5} delay={0} />

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      
                      <h4 className="text-base font-bold text-slate-900 leading-snug tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      
                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogDetail;
