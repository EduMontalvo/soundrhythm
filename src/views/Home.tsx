import TurntablePlayer from "../components/TurntablePlayer"
import ListRadios from "../components/ListRadios"
import Slider from "../components/Slider"
import { useRadioStore } from "../stores/useRadioStore"

const Home = () => {
  const radioList = useRadioStore((state) => state.radiosBackUp)

  return (
    <div className="flex flex-col">
      <TurntablePlayer />
      <Slider slides={radioList} />
      <div className="grow">
        <ListRadios />
      </div>
    </div>
  )
}

export default Home
