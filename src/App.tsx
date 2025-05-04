import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./store/store";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "./styles/antd.css";

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
          },
        }}
      >
        <Router>
          <ToastContainer position="top-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
