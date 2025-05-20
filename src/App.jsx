import { useEffect, useState } from "react";
import "./App.css";
import Card from "./Card";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [data, setData] = useState([]);
  const [delayedData, setDelayedData] = useState([]);
  const [visualize, setVisualize] = useState("all");
  const [theme, setTheme] = useState("light");

  // Carica dati e assegna ID univoci
  useEffect(() => {
    fetch("data.json")
      .then((res) => res.json())
      .then((rawData) => {
        const dataWithId = rawData.map((card) => ({
          ...card,
          id: uuidv4(),
        }));
        setData(dataWithId);
        setDelayedData(dataWithId);
      });
  }, []);

  // Applica il tema al body
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  // Aggiorna delayedData 3s dopo ogni modifica a data
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedData(data);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [data]);

  // Rimuove card
  function removeCard(idToRemove) {
    setData((prevData) => prevData.filter((card) => card.id !== idToRemove));
  }

  // Cambia stato attivo/inattivo subito
  function changeActive(idToToggle) {
    setData((prevData) =>
      prevData.map((card) =>
        card.id === idToToggle ? { ...card, isActive: !card.isActive } : card
      )
    );
  }

  // Calcola gli ID visibili in base a delayedData e filtro
  const visibleIds = delayedData
    .filter((card) => {
      if (visualize === "all") return true;
      if (visualize === "a") return card.isActive;
      if (visualize === "i") return !card.isActive;
      return true;
    })
    .map((card) => card.id);

  // Renderizza solo le card con id in visibleIds, usando lo stato immediato `data` per i dettagli
  const cards = data
    .filter((card) => visibleIds.includes(card.id))
    .map((card) => (
      <Card
        key={card.id}
        logo={card.logo}
        name={card.name}
        description={card.description}
        isActive={card.isActive}
        onRemove={() => removeCard(card.id)}
        onChangeActive={() => changeActive(card.id)}
      />
    ));

  function changeTheme() {
    setTheme((tema) => (tema === "light" ? "dark" : "light"));
  }
  
  return (
    <>
      <header>
        <img 
          id= 'start-logo'
          alt="ico"
          src={
              theme === "light"
                ? "./assets/images/logo.svg"
                : "./assets/images/logo_white.svg"
            } />
        <button onClick={changeTheme}>
          <img
            id="sun-moon"
            src={
              theme === "light"
                ? "./assets/images/icon-moon.svg"
                : "./assets/images/icon-sun.svg"
            }
            alt="ico"
          />
        </button>
      </header>
      <nav>
        <h1>Extensions List</h1>
        <span>
          <button
            className={visualize === 'all' ? 'redButt' : 'whiteButt'}
            onClick={() => setVisualize("all")}
          >
            All
          </button>
          <button 
            className={visualize === 'a' ? 'redButt' : 'whiteButt'}
            onClick={() => setVisualize("a")}
          >
            Active
          </button>
          <button 
            className={visualize === 'i' ? 'redButt' : 'whiteButt'}
            onClick={() => setVisualize("i")}
          >
            Inactive
          </button>
        </span>
      </nav>
      <div className='cards-layout'>{cards.length > 0 && cards}</div>
    </>
  );
}

export default App;