
import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

const STAGES = ["Start", "Playing", "End"];

const initialState = {
  isLoading: true,
  gameStage: STAGES[0],
  questions: [],
  currentQuestion: 0,
  score: 0,
  answerSelected: false,
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTIONS":
      return {
        ...state,
        questions: action.payload,
        isLoading: false,
      };

    case "CHANGE_STATE":
      return {
        ...state,
        gameStage: STAGES[1],
      };

    case "REORDER_QUESTIONS":
      const reorderedQuestions = state.questions.sort(
        () => Math.random() - 0.5
      );
      return {
        ...state,
        questions: reorderedQuestions,
      };

    case "CHANGE_QUESTION":
      const nextQuestion = state.currentQuestion + 1;
      let endGame = state.currentQuestion + 1 >= state.questions.length;

      return {
        ...state,
        currentQuestion: nextQuestion,
        gameStage: endGame ? STAGES[2] : state.gameStage,
        answerSelected: false,
      };

    case "NEW_GAME":
      return {
        ...initialState,
        questions: state.questions,
        isLoading: false,
      };
    case "START_LOADING":
      return {
        ...state,
        isLoading: true,
      };

    case "STOP_LOADING":
      return {
        ...state,
        isLoading: false,
      };

    case "CHECK_ANSWER":
      if (state.answerSelected) return state;

      const { answer, option } = action.payload;
      let correctAnswer = answer === option ? 1 : 0;

      return {
        ...state,
        score: state.score + correctAnswer,
        answerSelected: true,
      };

    default:
      return state;
  }
};

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  useEffect(() => {
    const fetchQuestions = async () => {
      dispatch({ type: "START_LOADING" });
      try {
        const response = await axios.get(
          "https://be-teste-tec-b5dc1a90bbd0.herokuapp.com/api/atividades/list"
        );
        if (response.data.message == "SUCCESS") {
          const questions = response.data.data.map((question) => {
            return {
              question: question.pergunta,
              options: [
                question.resposta_correta,
                question.resposta_errada1,
                question.resposta_errada2,
              ],
              answer: question.resposta_correta,
            };
          });
          dispatch({ type: "SET_QUESTIONS", payload: questions });
        } else {
          console.error("Aconteceu um erro ao buscar perguntas:", error);
          dispatch({ type: "STOP_LOADING" });
        }
      } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        dispatch({ type: "STOP_LOADING" });
      }
    };

    fetchQuestions();
  }, []);

  return (
    <QuizContext.Provider value={[state, dispatch]}>
      {children}
    </QuizContext.Provider>
  );
};
