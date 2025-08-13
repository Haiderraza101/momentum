'use client'
import fetchIslambadWeather from '../lib/api/weather';
import { useState,useEffect } from 'react';
import { TiWeatherPartlySunny } from "react-icons/ti";
import { RiCelsiusFill } from "react-icons/ri";
import {motion} from 'framer-motion'
import { Weather } from "@/types/weather";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineArrowOutward } from "react-icons/md";
import Link from 'next/link';
import { IoMdClose } from "react-icons/io";

export default function WeatherComponent(){
  const [opentemperature,setopentemperature]=useState<boolean>(false);
  const [weather,setweather]=useState<Weather>();
 
  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchIslambadWeather();
      setweather(data);
    };
    getWeather();
  }, []);

  return (
     <div>
      
    <div className='p-6 relative '>
    <div className="flex flex-col gap-1 p-2  rounded-2xl transition-all duration-300 hover:bg-white/15 hover:backdrop-blur-md hover:shadow-md cursor-pointer"  onClick={()=>setopentemperature(!opentemperature)}>
    <div className='flex gap-2 cursor-pointer'
   >
      <TiWeatherPartlySunny size={30} />
      <div className='flex text-xl font-semibold'>
        <div >
        {weather?.temperature}
      </div>
      <div>
        <RiCelsiusFill size={23}/>

      
      </div>
      </div>
     </div>
      <div className='pl-2'>
        Islamabad
      </div>
      
    </div>
    </div>

   {opentemperature && (
    <div className='absolute bg-black opacity-80 text-white px-4 py-2 rounded-xl shadow-lg z-50 w-100 right-15 top-25'>
  
     <motion.div
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       exit={{ opacity: 0, scale: 0.95 }}
       transition={{ duration: 0.3 }}
     >
       <div className="flex justify-between bg-black p-2 opacity-80 rounded-xl  relative">
         <div className="flex gap-2">
           <TiWeatherPartlySunny size={20} />
           <h2>Islamabad Weather</h2>
         </div>
         <div >
           <IoMdClose
             size={20}
             className='cursor-pointer'
           onClick={()=>{
            setopentemperature(false)
           }}
           />
         
         </div>
       
       </div>
         <div className='text-gray-400'>
          {weather?.condition}
          </div>

          <div className='flex gap-10'>
            <div className='flex p-5 pl-2 gap-2 text-5xl font-bold '>
              <div>
              <TiWeatherPartlySunny></TiWeatherPartlySunny>
              </div>
              <div>
                {weather?.temperature}

              </div>
              <div>
                <RiCelsiusFill></RiCelsiusFill>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex gap-1'>
              Feels like {" "} {weather?.feelsLike} {" "} <RiCelsiusFill className='mt-1'></RiCelsiusFill>
              </div>
              <div>
                <div className='flex gap-1'>
                  Wind {" "} <MdOutlineArrowOutward className='mt-1'/> {' '} {weather?.windSpeed} km/h
                  </div>
                
              </div>
            </div>
          </div>
          <div className='border-t border-t-gray-600'>
           <Link href="https://www.meteo.com/"
          className='flex justify-end mt-2'>
            Meteo
          </Link>
          </div>
         
     </motion.div>
   </div>
  )}
   </div>
    
  )
}