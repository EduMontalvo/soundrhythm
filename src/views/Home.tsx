import MusicPlayer from "../components/MusicPlayer"
import Hero from "../components/Hero"
import ListRadios from "../components/ListRadios"


const Home = () => {
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

export default Home