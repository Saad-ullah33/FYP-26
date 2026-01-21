import { Button, Input } from '@mantine/core';
import React, { useState } from 'react'

const DreamProp = () => {
    const [active, setActive] = useState('Buy');
      const buttons = ['Buy', 'Rent', 'Projects'];
  return (
    <div className=''>
        <div>
    <section className="relative w-full h-[80vh]">
      
      {/* Image */}
      <img
        src="/home.jpg"
        alt="Faisalabad"
        className="w-full h-full object-cover"
      />

      {/* Dark overlay to dark the image  */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content on top of image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-red-700 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Find Your Dream Property
        </h1>
    <div className="flex gap-3 mt-6">
      {buttons.map((label) => (
        <Button
          key={label}
          variant={active === label ? 'filled' : 'subtle'}
          styles={(theme) => ({
            root: {
              minWidth: 120, // equal width
              color: active === label ? 'black' : 'white', // text color
              backgroundColor:
                active === label ? 'white' : theme.colors.blue[5], // bg color
            },
          })}
          onClick={() => setActive(label)}
        >
          {label}
        </Button>
      ))}
    </div>




        <p className="mt-4 text-lg text-center font-semibold max-w-xl">
          Buy, Rent or Sell properties easily
        </p>

        {/* Search field  */}
        <div className="flex bg-black/60 w-[70]">
         <Input className='px-4 m-5' variant="filled" size="md" radius="xs"  placeholder="Input component" />

        </div>
      </div>

    </section>
       
        </div>
      
    </div>
  )
}

export default DreamProp
