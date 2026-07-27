import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ChatRoomPage from "./pages/ChatRoomPage.tsx";
import MeetingPage from "./pages/MeetingPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/chat/:roomId"
                    element={<ChatRoomPage />}
                />

                <Route
                    path="/meeting/:roomId"
                    element={<MeetingPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;