import { Video } from "lucide-react";

function HomeHeader() {
    return (
        <div className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800">
                <Video className="h-8 w-8 text-white" />
            </div>

            <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    Whisper Room
                </h1>

                <p className="mt-2 text-sm text-zinc-400">
                    Secure real-time meetings powered by WebRTC
                </p>
            </div>
        </div>
    );
}

export default HomeHeader;