import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';
import ScrollReveal from '../components/ScrollReveal';
import BorderBeam from '../components/BorderBeam';
import { blogArticles } from '../Data/blogData';

const Blog = () => {
  // Use first 3 articles for the home page teaser section
  const articles = blogArticles.slice(0, 3);

  return (
    // Alternating pure white container with a thin top dividing line
    <div className='py-20 bg-white border-t border-slate-100'>
      <div className='px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto'>
        
        {/* ── SECTION HEADER ── */}
        <ScrollReveal direction="up" duration={0.8}>
          <div className='flex justify-between items-end mb-10'>
            <div className='space-y-2'>
              <span className="text-blue-600 font-extrabold uppercase text-xs tracking-wider block">
                Exclusive Insights
              </span>
              <h2 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
                Trending Articles & Guides
              </h2>
            </div>
            
            <Link 
              to="/blogs" 
              className="hidden md:flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3.5 transition-all duration-200 cursor-pointer"
            >
               See All Articles <IconArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        {/* ── RESPONSIVE 3-COLUMN CARD GRID ── */}
        <ScrollReveal 
          cascade={true} 
          direction="up" 
          staggerAmount={0.12} 
          duration={0.8}
          className='grid grid-cols-1 md:grid-cols-3 gap-8'
        >
          {articles.map((post) => (
            
            // CARD CONTAINER (Link to details view)
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="relative group flex flex-col bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-100/60 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer h-full block text-left"
            >
              {/* Premium Border Beam animation */}
              <BorderBeam size={160} duration={8} borderWidth={1.5} delay={0} />
              
              {/* Image Section */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Floating Pastel Category Tag */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slate-100/40">
                  {post.category}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                
                <div>
                  {/* Date & Metadata with clean inline SVG clock to prevent dependency crashes */}
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{post.date}</span>
                    <span className="mx-1">•</span>
                    <span>{post.readTime}</span>
                  </div>

                  {/* Title (Bounded to exactly 2 lines for uniform card alignments) */}
                  <h3 className="text-lg font-bold text-slate-900 mt-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-snug">
                    {post.title}
                  </h3>

                  {/* Excerpt (Bounded to exactly 3 lines for uniform card alignments) */}
                  <p className="text-slate-500 text-sm leading-relaxed mt-2.5 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* ── CARD BOTTOM AUTHOR FOOTER ── */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Circle Initial Avatar */}
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xs shadow-inner">
                      {post.authorAvatar || post.author[0]}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{post.author}</span>
                  </div>

                  {/* Sliding CTA Arrow */}
                  <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200">
                    <IconArrowRight size={15} />
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </ScrollReveal>

      </div>
    </div>
  );
};

// Double-export pattern guarantees that both default and named imports work safely
export { Blog };
export default Blog;