import MusicPlayer from "./MusicPlayer"
import Hero from "./Hero"
import ListRadios from "./ListRadios"

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <div className="grow">
        <ListRadios />
      </div>
      <MusicPlayer />
    </div>
  )
}

export default Main