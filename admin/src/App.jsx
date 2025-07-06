import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <Header />
      </BrowserRouter>
    </>
  );
}

export default App;
