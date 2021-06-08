import "./App.css";
import { useState, useEffect } from "react";
import Pastes from "./components/Pastes";
import Header from "./components/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

function App() {
  const [pastes, setPastes] = useState({
    page: 1,
    list: [],
    count: 0,
    hasMore: false,
  });

  const getPastes = () => {
    axios
      .get(
        `http://backend:8090/api/paste/all?limit=15&offset=${
          (pastes.page - 1) * 15
        }`
      )
      .then(({ data }) => {
        const state = {
          count: data.rows.length + pastes.list.length,
          list: [...new Set([...pastes.list, ...data.rows])],
          hasMore: pastes.count < data.count,
          page: ++pastes.page,
        };
        setPastes(state);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPastes();
  }, []);

  return (
    <div className="App">
      <Header />
      <InfiniteScroll
        dataLength={pastes.list.length}
        next={getPastes}
        hasMore={pastes.hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You're all caught up!</b>
          </p>
        }
      >
        <Pastes pastes={pastes.list} />
      </InfiniteScroll>
    </div>
  );
}

export default App;
