import React from 'react'
import BuildSmart from '../LandingPages/BuildSmart'
import DreamProp from '../LandingPages/DreamProp'
import Explore from '../LandingPages/Explore'
import Blog from '../LandingPages/Blog'
import { Projects } from '../LandingPages/Projects'

const HomePage = () => {
  return (
    <div>
        <DreamProp/>
        <BuildSmart/>

        <Explore/>
        <Blog/>

        <Projects/>
    </div>
  )
}

export default HomePage
