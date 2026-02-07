import ImgPrueba from '../assets/pexels-tomas-malik-793526-3022417.jpg'
import { BsSoundwave } from "react-icons/bs";

const Hero = () => {
  return (
    <div className='relative mx-auto mt-10 overflow-hidden aspect-video rounded-2xl w-[90%]'>
      <img src={ImgPrueba} alt="" className='absolute object-cover h-full w-full inset-0' />
      <div className='h-8 w-8 bg-neutral-200 flex justify-center items-center rounded-full absolute right-4 top-4 '>
        <BsSoundwave />
      </div>

      <div className='absolute inset-y-20 px-8 text-white space-y-1'>
        <p className='uppercase text-xs'>currently Playing</p>
        <h2 className='capitalize text-3xl'>forest whisper</h2>
        <p className='capitalize text-xs'>ambient nature radio</p>
      </div>
    </div>
  )
}

export default Hero

/* my-8 relative */
/* w-[90%] rounded-3xl mx-auto object-cover aspect-video */