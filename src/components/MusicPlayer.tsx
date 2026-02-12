import { useEffect, useRef, useState } from "react";
import { GiPauseButton } from "react-icons/gi";
import { PiSpeakerHighLight, PiSpeakerSimpleSlashThin } from "react-icons/pi";
import { useRadioStore } from "../stores/useRadioStore";
import { RiPlayLargeFill } from "react-icons/ri";

const MusicPlayer = () => {

    const AudioRef = useRef<HTMLAudioElement>(null)
    const pickRadio = useRadioStore((state) => state.radioplay)
    const isPlaying = useRadioStore((state) => state.isPlaying)
    const setPlaying = useRadioStore((state) => state.setPlaying)
    const [muted, setMuted] = useState(false)

    useEffect(() => {
        if (AudioRef.current && pickRadio && isPlaying) {
            AudioRef.current.play()
        }
    }, [pickRadio, isPlaying])

    const handlePlayAndPause = (playingnow: boolean) => {
        let darkplayingnow = !playingnow
        if (darkplayingnow) {
            AudioRef.current?.play()
            setPlaying(!playingnow)
            darkplayingnow = !darkplayingnow
        } else {
            AudioRef.current?.pause()
            setPlaying(!playingnow)
            darkplayingnow = !darkplayingnow
        }
    }

    const handleToggleMute = (muted: boolean) => {
        if (!AudioRef.current) return
        if (muted) {
            AudioRef.current.muted = false
            setMuted(!muted)
        } else {
            AudioRef.current.muted = true
            setMuted(!muted)
        }

    }


    return (
        <>

            <div className="flex justify-between p-5 bottom-0 bg-white sticky">
                <div className="flex items-center gap-5">
                    {isPlaying ?
                        (
                            <>
                                <button onClick={() => handlePlayAndPause(isPlaying)}>
                                    <RiPlayLargeFill className="text-4xl text-neutral-400 rounded-full" />
                                </button>
                                <div className="flex flex-col">
                                    <h2 className="font-bold text-xs">{pickRadio.name}</h2>
                                    <p className="uppercase text-xs text-neutral-400">{pickRadio.tags}</p>
                                </div>
                            </>
                        )
                        :
                        (
                            <>
                                <button onClick={() => handlePlayAndPause(isPlaying)}>
                                    <GiPauseButton className="text-4xl text-neutral-400 rounded-full" />
                                </button>
                                <div className="flex flex-col">
                                    <h2 className="font-bold text-xs">{pickRadio.name}</h2>
                                    <p className="uppercase text-xs text-neutral-400">{pickRadio.tags}</p>
                                </div>
                            </>
                        )
                    }
                </div>
                <audio ref={AudioRef} src={pickRadio.url_resolved}></audio>
                <button onClick={() => handleToggleMute(muted)}>
                    {
                        muted ?
                            <PiSpeakerSimpleSlashThin className="text-3xl text-neutral-400" />
                            :
                            <PiSpeakerHighLight className="text-3xl text-neutral-400" />
                    }

                </button>
            </div>
        </>

    )
}

export default MusicPlayer