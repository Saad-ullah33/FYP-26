import React from 'react'
// import boulevard from 'FlatPhotos/boulevard.jpg';
const boulevardImg = 'FlatPhotos/boulevard.jpg';
const callImg = 'FlatPhotos/call.svg';
const messageImg = 'FlatPhotos/message.svg';
const whatsappImg = 'FlatPhotos/whats.svg'; 
// const flatImg = 'FlatPhotos/flat.svg'; 

const Flats = () => {
  return (
    <div className='max-w-[100%]  max-h-full'>
      <div className='text-3xl font-bold mb-8'>484 Projects with Flats in Pakistan</div>
      <div className="card max-full bg-gray-200 h-[60vh] flex">
        <img className='w-[30vw] h-[50vh] rounded-2xl flex relative left-[70px] top-[18px] shadow-sm' src={boulevardImg} alt="" />
        <div className=''>
        <div className='relative left-[110px] top-[20px] text-xl mb-1'>BOULEVARD HEIGHTS</div>
        <p className='relative left-[110px] top-[20px] mb-2'>
            <img src="" alt="" />
            DHA Defense, Multan
        </p>
        <p className='relative left-[110px] top-[20px] text-xl mb-2'>
            PKR <span className='font-bold'>53.13 Lakh - 91.16 Lakh</span>
        </p>
        <p className='relative left-[110px] top-[20px] text-sm  mb-3 w-[40vw]'>
            Boulevard hieghts - where DHA Multan's Tranquillity Meets Urban VIbrance, The Skyline of DHA Multan is rapidly changing , shaping modern cultural aspects with luxurious ......
        </p>
        <p className='relative left-[110px] top-[20px] text-sm  mb-2 w-[20vw] h-[20vh]  rounded-md border border-gray-400'>
            
           <p className='m-5 text-[17px] font-semibold'>Flats</p>
           <div className='m-5'>
           <p className=' text-[13px] '><img src="" alt="" />
           1.63 - 2.79 Marla</p>
           <p className=' text-[13px] '><img src="" alt="" />
           Starting from PKR 53.13 Lakh</p>
           </div>
        </p>
        <div className='flex gap-3 items-center'>
            <button className= 'relative left-[110px] top-[20px] bottom-[10px] text-sm  mb-2 w-[20vw] h-[7vh]  rounded-md border border-gray-400 flex items-center justify-center gap-2'> <img className = " w-5 h-5 " src={messageImg} alt="" />Get more Info
            </button>
            <button className= 'relative left-[110px] top-[20px] text-sm  mb-2 w-[10vw] h-[7vh]  rounded-md border border-gray-400 flex items-center justify-center gap-2'>
                <img className = " w-5 h-5 " src={callImg} alt="" />Call
            </button>
            <button className= 'relative left-[110px] top-[20px] text-sm  mb-2 w-[6vw] h-[7vh]  rounded-md border border-gray-400 flex items-center justify-center gap-2 bg-green-900'><img className = " w-5 h-5 " src={whatsappImg} alt="" />
            </button>
            </div>
        
 
        </div>
      </div>
    </div>
  )
}

export default Flats
