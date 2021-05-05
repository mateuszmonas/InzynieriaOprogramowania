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
    },
  ];

  const [questions, setQuestions] = React.useState(sampleQuestions);
  const [current, setCurrent] = React.useState(questions[0]);

  const [answer, setAnswer] = React.useState("");

  const submitHandler = (e, id, answerNumber) => {
    e.preventDefault();
    console.log(id);
    const msg = {
      type : "quiz-answers",
      content: {"id" : id, "answer" : answerNumber},
    };
    state.socket.sendMessage(msg);
    const newQuestions = questions;
    newQuestions.shift();
    setQuestions(newQuestions);
    setCurrent(questions[0]);
  };

  const submitHandler2 = (e) => {
    e.preventDefault();
    console.log("answer" + " " + answer);
    const msg = {
      type : "quiz-answers",
      content: answer
    };
    state.socket.sendMessage(msg);
    const newQuestions = questions;
    newQuestions.shift();
    setQuestions(newQuestions);
    setCurrent(questions[0]);
  };

  const changeHandler = (e) => {
    const { value } = e.target;
    setAnswer(value);
  }

  return (
    <div className="question" style={{ width: state.questionWidth }}>
      {state.awaitsApproval ? (
        <h1>Waiting for permission from room owner</h1>
      ) : questions.length ? (
        current.hasOwnProperty("answers") ? (
          <div key={current.id} className="specificQuestion">
            <h1 className="questionProper">{current.question}</h1>
            <div className="questionRow">
              <div className="answer" onClick={(e) => submitHandler(e, current.id, 0)}>
                <h4>{current.answers[0]}</h4>
              </div>
              <div className="answer" onClick={(e) => submitHandler(e, current.id, 1)}>
                <h4>{current.answers[1]}</h4>
              </div>
            </div>
            <div className="questionRow" onClick={(e) => submitHandler(e, current.id, 2)}>
              <div className="answer">
                <h4>{current.answers[2]}</h4>
              </div>
              <div className="answer" onClick={(e) => submitHandler(e, current.id, 3)}>
                <h4>{current.answers[3]}</h4>
              </div>
            </div>
          </div>
        ) : (
          <div key={current.id} className="specificQuestion">
            <h1 className="questionProper">{current.question}</h1>
            <div className="questionRow">
              <form
                className="answer"
                style={{ "justifyContent": "center", width: "50%" }}
              >
                <input type="text" onChange={changeHandler} value={answer} id="answer" name="answer"></input>
                <button
                  type="submit"
                  className="answerButton"
                  onClick={(e) => submitHandler2(e)}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )
      ) : (
        <h1>There are no questions at the moment</h1>
      )}
    </div>
  );
};

export default Question;
