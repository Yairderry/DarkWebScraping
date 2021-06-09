import "./App.css";
import { useState, useEffect, useRef } from "react";
import Pastes from "./components/Pastes";
import Header from "./components/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

function App() {
  const initialPastes = {
    page: 1,
    list: [],
    count: 0,
    hasMore: false,
  };
  const [pastes, setPastes] = useState(initialPastes);

  const titleInputRef = useRef();
  const contentInputRef = useRef();
  const authorInputRef = useRef();

  const getPastes = (params) => {
    const title = titleInputRef.current.value
      ? `title=${titleInputRef.current.value}&`
      : "";

    const content = contentInputRef.current.value
      ? `content=${contentInputRef.current.value}&`
      : "";

    const author = authorInputRef.current.value
      ? `author=${authorInputRef.current.value}&`
      : "";

    axios
      .get(
        `http://localhost:8090/api/paste/all?${title}${content}${author}&limit=15&offset=${
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

  let cancelToken;
  const filterPastes = () => {
    setPastes(initialPastes);
    const title = titleInputRef.current.value
      ? `title=${titleInputRef.current.value}&`
      : "";

    const content = contentInputRef.current.value
      ? `content=${contentInputRef.current.value}&`
      : "";

    const author = authorInputRef.current.value
      ? `author=${authorInputRef.current.value}&`
      : "";

    if (cancelToken)
      cancelToken.cancel("Operation canceled due to new request.");

    cancelToken = axios.CancelToken.source();

    axios
      .get(
        `http://localhost:8090/api/paste/all?${title}${content}${author}&limit=15&offset=0`,
        {
          cancelToken: cancelToken.token,
        }
      )
      .then(({ data }) => {
        const state = {
          count: data.rows.length,
          list: data.rows,
          hasMore: pastes.count < data.count,
          page: 2,
        };

        setPastes(state);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPastes();
  }, []);

  return (
    <div className="App">
      <Header
        titleInputRef={titleInputRef}
        filterPastes={filterPastes}
        contentInputRef={contentInputRef}
        authorInputRef={authorInputRef}
      />
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
