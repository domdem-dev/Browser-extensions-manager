import { useState } from "react";
import "./Card.css";

export default function Card({
  logo,
  name,
  description,
  isActive,
  onRemove,
  onChangeActive,
}) {
  const [animate, setAnimate] = useState(false);

  function handleToggle() {
    setAnimate(true);
    onChangeActive();
    setTimeout(() => setAnimate(false), 300); // durata animazione
  }

  return (
    <article>
      <span id="content">
        <img src={logo} alt="ico" />
        <div>
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </span>

      <span id="buttons">
        <button id="remove" onClick={onRemove}>
          Remove
        </button>

        <button
          className={`toggle-btn ${isActive ? "active" : "inactive"}`}
          onClick={handleToggle}
        >
          <div className={`knob ${animate ? "knob-animate" : ""}`}></div>
        </button>
      </span>
    </article>
  );
}
