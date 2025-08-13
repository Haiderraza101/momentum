'use client'
import fetchIslambadWeather from '../lib/api/weather';
import { useState, useEffect } from 'react';
import { TiWeatherPartlySunny } from "react-icons/ti";
import { RiCelsiusFill } from "react-icons/ri";
import { motion } from 'framer-motion'
import { Weather } from "@/types/weather";
import { MdOutlineArrowOutward } from "react-icons/md";
import Link from 'next/link';
import { IoMdClose } from "react-icons/io";

export default function WeatherComponent() {
  const [opentemperature, setopentemperature] = useState<boolean>(false);
  const [weather, setweather] = useState<Weather>();

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchIslambadWeather();
      setweather(data);
    };
    getWeather();
  }, []);

  return (
    <div className="relative">
      <div className='p-4 sm:p-6'>
        <div 
          className="flex flex-col gap-1 p-2 rounded-2xl transition-all duration-300 hover:bg-white/15 hover:backdrop-blur-md hover:shadow-md cursor-pointer"
          onClick={() => setopentemperature(!opentemperature)}
        >
          <div className='flex items-center gap-2'>
            <TiWeatherPartlySunny size={30} />
            <div className='flex items-center text-xl sm:text-xl font-semibold'>
              <div>{weather?.temperature}</div>
              <RiCelsiusFill size={23} />
            </div>
          </div>
          <div className='pl-2 text-sm sm:text-base'>Islamabad</div>
        </div>
      </div>

      {opentemperature && (
        <div className='absolute bg-black text-white px-2 sm:px-4 py-2 rounded-xl shadow-lg z-50 w-[90vw] sm:w-[25rem] top-20 sm:right-15 right-20 max-w-[200px] pl-10 sm:pl-0 sm:max-w-[400px]'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between bg-black p-2 opacity-80 rounded-xl relative">
              <div className="flex gap-2 items-center">
                <TiWeatherPartlySunny size={20} />
                <h2 className='text-sm sm:text-base'>Islamabad Weather</h2>
              </div>
              <IoMdClose
                size={20}
                className='cursor-pointer'
                onClick={() => setopentemperature(false)}
              />
            </div>

            <div className='text-gray-400 text-sm sm:text-base mt-1'>
              {weather?.condition}
            </div>

            <div className='flex flex-col sm:flex-row gap-4 sm:gap-10 mt-2'>
              <div className='flex p-4 sm:p-5 pl-2 gap-2 text-3xl sm:text-5xl font-bold items-center'>
                <TiWeatherPartlySunny />
                {weather?.temperature}
                <RiCelsiusFill />
              </div>
              <div className='flex flex-col gap-2 text-sm sm:text-base'>
                <div className='flex gap-1 items-center'>
                  Feels like {weather?.feelsLike} <RiCelsiusFill className='mt-1' />
                </div>
                <div className='flex gap-1 items-center'>
                  Wind <MdOutlineArrowOutward className='mt-1' /> {weather?.windSpeed} km/h
                </div>
              </div>
            </div>

            <div className='border-t border-t-gray-600 mt-2'>
              <Link href="https://www.meteo.com/" className='flex justify-end mt-2 text-xs sm:text-sm'>
                Meteo
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
