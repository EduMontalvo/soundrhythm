import './embla.css'
import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { Radio } from '../schema/RadiosSchema'

type SliderProps = {
  slides: Radio[]
}

const Slider = ({ slides }: SliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])


  return (
    <div style={{ position: 'relative' }}>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((src, index) => (
            <div className="embla__slide" key={index}>
              <img src={src.favicon} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev}>← Anterior</button>
      <button onClick={scrollNext}>Siguiente →</button>
    </div>
  )
}

export default Slider
