import { useRef } from "react";
import { GiPauseButton } from "react-icons/gi";
import { PiSpeakerHighLight } from "react-icons/pi";
import { useRadioStore } from "../stores/useRadioStore";

const MusicPlayer = () => {

    const AudioRef = useRef(null)

    const pickAudio = useRadioStore((state) => state.radioplay)

    const verifyAudio = useRadioStore((state) => state.radioplay)

    console.log(pickAudio)

    return (
        <>
            {verifyAudio.url_resolved ?
                (
                    <>
                        <div className="flex justify-between p-5 bottom-0 bg-white sticky">
                            <audio src=""></audio>
                            <div className="flex items-center gap-5">
                                <GiPauseButton className="text-4xl text-neutral-400 rounded-full" />
                                <div className="flex flex-col">
                                    <h2 className="font-bold text-xs">{verifyAudio.name}</h2>
                                    <p className="uppercase text-xs text-neutral-400">{verifyAudio.tags}</p>
                                </div>
                            </div>
                            <audio ref={AudioRef} src={pickAudio.url_resolved}></audio>
                            <PiSpeakerHighLight className="text-3xl text-neutral-400" />
                        </div>
                    </>
                )
                :
                (
                    <>
                        <div className="flex justify-between p-5 bottom-0 bg-white sticky">
                            <audio src=""></audio>
                            <div className="flex items-center gap-5">
                                <GiPauseButton className="text-4xl text-neutral-400 rounded-full" />
                                <div className="flex flex-col">
                                    <h2 className="font-bold text-xs">Last FM</h2>
                                    <p className="uppercase text-xs text-neutral-400">Not playing</p>
                                </div>
                            </div>
                            <PiSpeakerHighLight className="text-3xl text-neutral-400" />
                        </div>
                    </>
                )
            }
        </>

    )
}

export default MusicPlayer