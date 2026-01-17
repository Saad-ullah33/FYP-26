import React from 'react'
import BuildSmart from '../LandingPages/BuildSmart'
import DreamProp from '../LandingPages/DreamProp'
import Explore from '../LandingPages/Explore'
import Blog from '../LandingPages/Blog'
import { Projects } from '../LandingPages/Projects'
import { Partners } from '../LandingPages/Partners'

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
        <DreamProp/>
        <BuildSmart/>
        <Explore/>
        <Partners/>
        <Projects/>
        <Blog/>

    </div>
  )
}

export default HomePage
