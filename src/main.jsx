import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import AuctionList from './pages/auction/AuctionList';
import Regist from './pages/auction/AuctionRegist';
import Detail from './pages/auction/AuctionDetail';

/*
예시 입니다. 이런식으로 가져다와서 쓰시죠.
import Acthistory from './components/acthistory.ks'
import Auction from './pages/List'
import Chatting from './pages/Create'
import Community from './pages/Update'
import Payment from './pages/Delete'
import Sale from './pages/Delete'
import User from './pages/Delete'
*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* HOME은 나중에 */}
        <Route path="/" element={<App />} />

        {/* acthistory */}
        {/* <Route path="/acthistory" element={<Acthistory />} /> */}

        {/* auction */}
        {/* <Route path="/auction" element={<Auction />} /> */}
        <Route path="/auction/auctions" element={<AuctionList />}></Route>
        <Route path="/auction/regists" element={<Regist />}></Route>
        <Route path="/auction/details" element={<Detail />}></Route>

        {/* chatting */}
        {/* <Route path="/chatting" element={<Chatting />} /> */}

        {/* community */}
        {/* <Route path="/community" element={<Community />} /> */}

        {/* payment */}
        {/* <Route path="/payment" element={<Payment />} /> */}

        {/* sale */}
        {/* <Route path="/sale" element={<Sale />} /> */}

        {/* user */}
        {/* <Route path="/user" element={<User />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
