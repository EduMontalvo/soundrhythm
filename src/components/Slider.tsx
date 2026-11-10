import '../embla.css'
import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { Radio } from '../schema/RadiosSchema'
import { AlterImage } from '../data/data'
import { ImNext, ImPrevious } from 'react-icons/im'

type SliderProps = {
  slides: Radio[]
}

const Slider = ({ slides }: SliderProps) => {

  const getRandomFallbackImage = () => {
    const randomIndex = Math.floor(Math.random() * AlterImage.length)
    return AlterImage[randomIndex]?.image ?? ""
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = getRandomFallbackImage()
  }


  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])


  return (
    <div style={{ position: 'relative' }}>
      <div className='w-[90%] mx-auto'>
        <h2 className='mt-4'>Your Favorites</h2>
      </div>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((src, index) => (
            <div className="embla__slide" key={index}>
              <img src={src.favicon || getRandomFallbackImage()} alt={`Slide ${index}`} onError={handleImageError} />
            </div>
          ))}
        </div>
      </div>
      <div className='w-[90%] mx-auto flex gap-2'>
        <button onClick={scrollPrev} className='h-4'><ImPrevious /></button>
        <button onClick={scrollNext} className='h-4'><ImNext /></button>
      </div>
    </div>
  )
}

export default Slider
