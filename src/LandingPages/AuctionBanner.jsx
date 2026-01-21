import { Divider } from '@mantine/core'
import { IconFileCheckFilled } from '@tabler/icons-react'
import React from 'react'

export const AuctionBanner = () => {
  return (<>
    <div className="bg-blue-200 text-white py-10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl text-black font-bold mb-4">Sell Your Property with Ease Through <span className='underline text-blue-600'>Bidding!</span></h2>
      </div>
<div className="flex flex-col md:flex-row gap-6 justify-around text-center">
  
  {/* Card */}
  <div className="max-w-xs p-4">
    <div className="flex justify-center mb-2">
      <img
        className="h-10 w-10"
        src="https://res.cloudinary.com/dr3ie9gpz/image/upload/v1739352981/emehyfjsfhivhsyjsaki.webp"
        alt="verified"
      />
    </div>

    <div className="text-black font-semibold mb-1">
      Verified Dealers
    </div>

    <p className="text-black text-sm leading-relaxed">
      Explore only trusted, verified dealers for a seamless buying experience.
    </p>
  </div>

  {/* Card */}
  <div className="max-w-xs p-4 border border-gray-300 rounded-lg">
    <div className="flex justify-center mb-2">
      <IconFileCheckFilled className="h-10 w-10 text-blue-500"
/>
    </div>

    <div className="text-black font-semibold mb-1">
      Trusted Listings
    </div>

    <p className="text-black text-sm leading-relaxed">
      Browse listings that are verified and reviewed to ensure complete reliability.
    </p>
  </div>

  {/* Card */}
  <div className="max-w-xs p-4">
    <div className="flex justify-center mb-2">
      <img
        className="h-10 w-10"
        src="https://res.cloudinary.com/dr3ie9gpz/image/upload/v1739352935/br5b7uyssnqyijfqx0zt.webp"
        alt="verified"
      />
    </div>

    <div className="text-black font-semibold mb-1">
      Auction
    </div>

    <p className="text-black text-sm leading-relaxed">
     Bid on your favorite property in exciting online auctions with competitive pricing!
    </p>
  </div>

</div>

    </div>
<Divider color='black' size={'sm'} />
    </>
  )
}
