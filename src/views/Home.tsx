import MusicPlayer from "../components/MusicPlayer"
import Hero from "../components/Hero"
import ListRadios from "../components/ListRadios"
import SearchBar from "../components/SearchBar"
import Slider from "../components/Slider"


const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SearchBar />
      <Hero />
      {/* <Slider slides={[]}/> */}
      <div className="grow">
        <ListRadios />
      </div>
      <MusicPlayer />
    </div>
  )
}

export default Home