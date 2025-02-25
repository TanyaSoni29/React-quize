// import DateCounter from "./comaponent/DateCounter";
import { useEffect } from "react";
import Header from "./comaponent/Header";
import { useReducer } from "react";
import Main from "./comaponent/Main";
import Loader from "./comaponent/Loader";
import Error from "./comaponent/Error";
import StartScreen from "./comaponent/StartScreen";
import Question from "./comaponent/Question";
import NextButton from "./comaponent/NextButton";
const initialState = {
  questions: [],

  // loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    default:
      throw new Error("Unknown Action");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { questions, status, answer, index, points } = state;
  const numQuestions = questions.length;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetch("http://localhost:8000/questions");
        const arrayQuestions = await data.json();
        dispatch({ type: "dataReceived", payload: arrayQuestions });
      } catch (error) {
        console.log(error);
        dispatch({ type: "dataFailed" });
      }
    }
    fetchData();
  }, []);

  console.log(questions);

  return (
    <div className="app">
      {/* <DateCounter /> */}
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen length={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
