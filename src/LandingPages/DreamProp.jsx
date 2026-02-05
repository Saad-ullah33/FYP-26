import { Button, Select, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { IconSearch, IconChevronDown } from '@tabler/icons-react'; // Optional icons

const DreamProp = () => {
  const [city, setCity] = useState('Islamabad');
  const [propertyType, setPropertyType] = useState('Homes');
   const [active, setActive] = useState('Buy');
      const buttons = ['Buy', 'Rent', 'Projects'];

  return (
    <div className="relative w-full h-screen">
      
      {/* Background Image Setup */}
      <div className="absolute inset-0">
        <img
          src="/home.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 mb-8 shadow-black drop-shadow-md">
          Find Your Dream Property
        </h1>

        <div className="flex gap-3 mt-2 mb-2">
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


        {/* --- SEARCH CONTAINER --- */}
        <div className="w-full max-w-4xl bg-black/60 p-6 rounded-lg backdrop-blur-sm mt-2">
          
          {/* Top Row: The 3 White Input Boxes */}
          <div className="flex flex-col md:flex-row gap-2 w-full">
            
            {/* 1. CITY FIELD */}
            <div className="bg-white flex-1 p-2 rounded flex flex-col justify-center h-16 relative cursor-pointer group">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider absolute top-2 left-3">
                City
              </label>
              <Select 
                variant="unstyled"
                value={city}
                onChange={setCity}
                data={['Islamabad', 'Lahore', 'Karachi']}
                rightSection={<IconChevronDown size={16} className="text-gray-500" />}
                styles={{
                  input: { 
                    paddingLeft: '0.75rem', 
                    paddingTop: '1rem', 
                    fontWeight: 600, 
                    color: '#1f2937' // dark gray text
                  }
                }}
              />
            </div>

            {/* 2. LOCATION FIELD */}
            <div className="bg-white flex-[2] p-2 rounded flex flex-col justify-center h-16 relative">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider absolute top-2 left-3">
                Location
              </label>
              <TextInput
                variant="unstyled"
                placeholder="DHA, Bahria Town, etc."
                styles={{
                  input: { 
                    paddingLeft: '0.75rem', 
                    paddingTop: '1rem',
                    color: '#1f2937'
                  }
                }}
              />
            </div>

            {/* 3. PROPERTY TYPE FIELD */}
            <div className="bg-white flex-1 p-2 rounded flex flex-col justify-center h-16 relative cursor-pointer">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider absolute top-2 left-3">
                Property Type
              </label>
               <Select 
                variant="unstyled"
                value={propertyType}
                onChange={setPropertyType}
                data={['Homes', 'Plots', 'Commercial']}
                rightSection={<IconChevronDown size={16} className="text-gray-500" />}
                styles={{
                  input: { 
                    paddingLeft: '0.75rem', 
                    paddingTop: '1rem', 
                    fontWeight: 600, 
                    color: '#1f2937'
                  }
                }}
              />
            </div>

          </div>

          {/* Bottom Row: Centered Find Button */}
          <div className="flex justify-center mt-6">
            <Button 
              size="lg"
              className=" bg-gradient-to-r from-cyan-500 to-blue-300 hover:bg-blue-700 transition-colors shadow-lg px-12"
            >
              FIND
            </Button>
          </div>
        
        

        </div>

      </div>
    </div>
  )
}

export default DreamProp;