import React from 'react'
import BuildSmart from '../LandingPages/BuildSmart'
import DreamProp from '../LandingPages/DreamProp'
import Blog from '../LandingPages/Blog'
import { Projects } from '../LandingPages/Projects'
import { Partners } from '../LandingPages/Partners'
import { AuctionBanner } from '../LandingPages/AuctionBanner'
import ExplorePage from '../LandingPages/ExplorePage'

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
        <DreamProp/>
        <AuctionBanner/>
        <BuildSmart/>
        <ExplorePage/>
        <Partners/>
        <Projects/>
        <Blog/>

    </div>
  )
}

export default HomePage
