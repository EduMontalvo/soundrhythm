import { BsSoundwave } from "react-icons/bs";
import { useRadioStore } from '../stores/useRadioStore';
import { useEffect, useState } from "react";
import DefultImg from '../assets/defaultimg.jpg'

const Hero = () => {

  const pickRadio = useRadioStore((state) => state.radioplay)
  const showCurrentPlaying = useRadioStore((state) => state.isPlaying)

  const [img, setImg] = useState(DefultImg)

  useEffect(() => {
    if (pickRadio.favicon) {
      setImg(pickRadio.favicon)
    } else {
      setImg(DefultImg)
    }
  }, [pickRadio])



  return (
    <div className='relative mx-auto overflow-hidden aspect-video rounded-2xl w-[90%]'>
      <img src={img} alt="" className='absolute object-cover h-full w-full inset-0 brightness-50' />
      <div className='h-8 w-8 bg-neutral-200 flex justify-center items-center rounded-full absolute right-4 top-4 '>
        <BsSoundwave />
      </div>

      <div className='absolute inset-y-20 px-8 text-white space-y-1'>
        {
          showCurrentPlaying &&
          <>
            <p className='uppercase text-xs bg-emerald-500 px-2 py-1 w-fit rounded-full'>currently playing</p>
            <h2 className='capitalize text-3xl'>{pickRadio.name}</h2>
            <div className="flex items-center gap-2">
              <p className='capitalize text-xs text-slate-200 whitespace-nowrap'>{pickRadio.tags}</p>
              <div className="bg-red-500 rounded-full h-2 w-2 animate-pulse"></div>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default Hero