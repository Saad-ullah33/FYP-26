import React from 'react'

const Blog = () => {
  return (
    <div>
       {/* --- BLOGS SECTION --- */}
      <section className=" mx-auto py-20 px-6">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Latest Insights</h2>     
        <div className="grid grid-cols-3  gap-8">      
            <div  className="bg-blue-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-2 border border-slate-100">
              <span className="text-sm font-semibold text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione mollitia rerum, in ullam alias consequuntur? Vitae nesciunt eligendi debitis earum magni dolorum. Sed!</span>           
              <div><button className="text-white font-bold hover:underline">Read Article →</button></div>
            </div>       
        </div>
      </section>
    </div>
  )
}

export default Blog
