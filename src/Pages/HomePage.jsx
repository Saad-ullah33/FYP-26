import React from 'react'
import BuildSmart from '../LandingPages/BuildSmart'
import DreamProp from '../LandingPages/DreamProp'
import Blog from '../LandingPages/Blog'
import { Projects } from '../LandingPages/Projects'
import { Partners } from '../LandingPages/Partners'
import { AuctionBanner } from '../LandingPages/AuctionBanner'
import ExplorePage from '../LandingPages/ExplorePage'
import  { HomeCta } from '../LandingPages/HomeCta'
import  { Faq } from '../LandingPages/Faq'
import AdminDashboard from '../Admin/AdminDashboard'

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
        <DreamProp/>
        <AuctionBanner/>
        {/* <BuildSmart/> */}
        <ExplorePage/>
        <Partners/>
        <HomeCta/>
        <Projects/>
        <Blog/>
        <Faq/>
        {/* <AdminDashboard/> */}


    </div>
  )
}

export default HomePage
