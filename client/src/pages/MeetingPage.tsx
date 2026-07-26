import { useLocation } from "react-router-dom";

function MeetingPage() {
    const { state } = useLocation();

    console.log(state);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
            Meeting Page
        </div>
    );
}

export default MeetingPage;