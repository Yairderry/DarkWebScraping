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
  const [labels, setLabels] = useState([]);
  const [labelsFilter, setLabelsFilter] = useState([]);
  const isInitialMount = useRef(true);

  const titleInputRef = useRef();
  const contentInputRef = useRef();
  const authorInputRef = useRef();

  const getLabels = () => {
    axios
      .get(`http://localhost:8090/api/paste/labels`)
      .then(({ data }) => {
        setLabels(data);
      })
      .catch((err) => console.log(err));
  };

  const getPastesURL = (pagination) => {
    const title = titleInputRef.current.value
      ? `title=${titleInputRef.current.value}&`
      : "";

    const content = contentInputRef.current.value
      ? `content=${contentInputRef.current.value}&`
      : "";

    const author = authorInputRef.current.value
      ? `author=${authorInputRef.current.value}&`
      : "";

    const labels = labelsFilter.map((label) => `labels=${label}&`).join("");

    return `http://localhost:8090/api/paste/all?${title}${content}${author}${labels}limit=15&offset=${
      pagination ? (pastes.page - 1) * 15 : 0
    }`;
  };
  const toggleLabelsFiler = (e) => {
    const label = e.target;
    const value = label.innerText;

    label.classList.toggle("checked");

    setLabelsFilter(
      labelsFilter.includes(value)
        ? labelsFilter.filter((labelFilter) => labelFilter !== value)
        : labelsFilter.concat(value)
    );
  };

  const getPastes = () => {
    axios
      .get(getPastesURL(true))
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

    if (cancelToken)
      cancelToken.cancel("Operation canceled due to new request.");

    cancelToken = axios.CancelToken.source();

    axios
      .get(getPastesURL(), {
        cancelToken: cancelToken.token,
      })
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
    getLabels();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      filterPastes();
    }
  }, []);

  return (
    <div className="App">
      <Header
        titleInputRef={titleInputRef}
        filterPastes={filterPastes}
        contentInputRef={contentInputRef}
        authorInputRef={authorInputRef}
        labels={labels}
        toggleLabelsFiler={toggleLabelsFiler}
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
