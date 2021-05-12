import React from "react";

const Question = ({ state, dispatch }) => {
  const sampleQuestions = [
    {
      id: 1,
      question: "What's the first letter of the alphabet?",
      answers: ["A", "D", "F", "P"],
    },
    {
      id: 2,
      question: "What's the capital of Germany?",
      answers: [],
    },
  ];

  function refreshPage() {
    window.location.reload(false);
  }

  const [questions, setQuestions] = React.useState([]);
  const [current, setCurrent] = React.useState(questions[0]);

  const [answer, setAnswer] = React.useState("");

  const updateQuestions = () => {
    let shift = true;
    if (questions.length == 0) shift = false;
    let newQuestions = questions;
    while (state.socket.questions.length > 0)
      newQuestions.push(state.socket.questions.shift());
    setQuestions(newQuestions);
    if (shift) questions.shift();
    setCurrent(questions[0]);
  };

  const submitHandler = (questionId, answerNumber) => {
    const msg = {
      type: "quiz-answers",
      content: { id: questionId, answers: [answerNumber] },
    };
    state.socket.sendMessage(msg);
    updateQuestions();
  };

  const submitHandler2 = (e, questionId) => {
    e.preventDefault();
    const msg = {
      type: "quiz-answers",
      content: { id: questionId, answers: [answer] },
    };
    state.socket.sendMessage(msg);
    updateQuestions();
    setAnswer("");
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (questions.length === 0) updateQuestions();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const changeHandler = (e) => {
    const { value } = e.target;
    setAnswer(value);
  };

  return (
    <div className="question" style={{ width: state.questionWidth }}>
      {state.awaitsApproval ? (
        <h1>Waiting for permission from room owner</h1>
      ) : questions.length ? (
        current.answers.length > 1 ? (
          <div key={current.id} className="specificQuestion">
            <h1 className="questionProper">{current.question}</h1>
            <div className="questionRow">
              <div
                className="answer"
                onClick={(e) => submitHandler(current.id, 0)}
              >
                <h4>A:</h4>
                <p style={{ textIndent: "3px" }}>{current.answers[0]}</p>
              </div>
            </div>
            <div className="questionRow">
              <div
                className="answer"
                onClick={(e) => submitHandler(current.id, 1)}
              >
                <h4>B:</h4>
                <p style={{ textIndent: "3px" }}>{current.answers[1]}</p>
              </div>
            </div>
            <div className="questionRow">
              <div
                className="answer"
                onClick={(e) => submitHandler(current.id, 2)}
              >
                <h4>C:</h4>
                <p style={{ textIndent: "3px" }}>{current.answers[2]}</p>
              </div>
            </div>
            <div className="questionRow">
              <div
                className="answer"
                onClick={(e) => submitHandler(current.id, 3)}
              >
                <h4>D:</h4>
                <p style={{ textIndent: "3px" }}>{current.answers[3]}</p>
              </div>
            </div>
          </div>
        ) : (
          <div key={current.id} className="specificQuestion">
            <h1 className="questionProper">{current.question}</h1>
            <div className="questionRow">
              <form
                className="answer"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "40px",
                  justifyContent: "space-evenly",
                  paddingLeft: "0px",
                  width: "50%"
                }}
              >
                <input
                  type="text"
                  onChange={changeHandler}
                  value={answer}
                  id="answer"
                  name="answer"
                  style={{
                    width: "70%"
                  }}
                ></input>
                <button
                  type="submit"
                  className="submit"
                  onClick={(e) => submitHandler2(e, current.id)}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )
      ) : (
        <h1>There are no questions at the moment</h1>
        // <div className="refresh">
        //         <button
        //           type="submit"
        //           className="refreshButton"
        //           onClick={updateQuestions}
        //         >
        //           Odśwież stronę
        //         </button>
        //     </div>
      )}
    </div>
  );
};

export default Question;
