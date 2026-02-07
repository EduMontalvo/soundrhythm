import { GiPauseButton } from "react-icons/gi";
import { PiSpeakerHighLight } from "react-icons/pi";

const MusicPlayer = () => {

    return (
        <div className="flex justify-between p-5 bottom-0 bg-white sticky">
            <audio src=""></audio>
            <div className="flex items-center gap-5">
                <GiPauseButton className="text-4xl text-neutral-400 rounded-full" />
                <div className="flex flex-col">
                    <h2 className="font-bold text-xs">Pause FM</h2>
                    <p className="uppercase text-xs text-neutral-400">midnigth city</p>
                </div>
            </div>
            <PiSpeakerHighLight className="text-3xl text-neutral-400" />
        </div>
    )
}

export default MusicPlayer