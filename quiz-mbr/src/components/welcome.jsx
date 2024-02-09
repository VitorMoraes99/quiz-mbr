import { useContext } from "react";
import { QuizContext } from "../context/quiz";

import Quiz from "../img/quiz.svg";

import "./Welcome.css"

const Welcome = () => {
  const [{ isLoading }, dispatch] = useContext(QuizContext);

  if (isLoading) {
    return (
      <div id="welcome" style={{ display: 'flex', flexDirection: 'Column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner"></div>
        <h3 style={{ marginTop: '2rem' }}>Carregando Dados</h3>
      </div>
    );
  }

  return (
    <div id="welcome">
        <h2>Seja bem-vindo</h2>
        <p>Clique no botão abaixo para começar</p>
        <button onClick={() => dispatch({ type: "CHANGE_STATE" })}>Iniciar</button>
        <img src={Quiz} alt="Inicio do Quiz" />
    </div>
  );
}

export default Welcome;
