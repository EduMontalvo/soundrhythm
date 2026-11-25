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
    const volume = useRadioStore((state) => state.volume)
    const [muted, setMuted] = useState(false)

    useEffect(() => {
        if (AudioRef.current) {
            AudioRef.current.volume = volume;
            if (volume > 0 && muted) {
                AudioRef.current.muted = false;
                setMuted(false);
            }
        }
    }, [volume, muted]);

    useEffect(() => {
        if (!AudioRef.current) return;
        if (pickRadio && isPlaying) {
            AudioRef.current.play().catch(() => {});
        } else {
            AudioRef.current.pause();
        }
    }, [pickRadio, isPlaying])

    const handlePlayAndPause = (playingnow: boolean) => {
        setPlaying(!playingnow);
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

            <div id="music-player" className="fixed bottom-0 left-0 right-0 w-full z-50 bg-white border-t border-slate-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] p-5 flex justify-between items-center">
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
