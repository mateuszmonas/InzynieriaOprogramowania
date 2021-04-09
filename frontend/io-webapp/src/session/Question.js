import React from "react";

const Question = (props) => {
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

  const submitHandler = (id) => {
    /* TODO */
    const newQuestions = questions;
    newQuestions.shift();
    console.log(newQuestions);
    setQuestions(newQuestions);
    setCurrent(questions[0]);
  };

  return (
    <div className="question" style={{ width: props.width }}>
      {questions.length ? (
        current.hasOwnProperty("answers") ? (
          <div key={current.id} className="specificQuestion">
            <h1 className="questionProper">{current.question}</h1>
            <div className="questionRow">
              <div className="answer">
                <button type="button" onClick={() => submitHandler()}>
                  A
                </button>
                <p>{current.answers[0]}</p>
              </div>
              <div className="answer">
                <button type="button" onClick={() => submitHandler()}>
                  B
                </button>
                <p>{current.answers[1]}</p>
              </div>
            </div>
            <div className="questionRow">
              <div className="answer">
                <button type="button" onClick={() => submitHandler()}>
                  C
                </button>
                <p>{current.answers[2]}</p>
              </div>
              <div className="answer">
                <button type="button" onClick={() => submitHandler()}>
                  D
                </button>
                <p>{current.answers[3]}</p>
              </div>
            </div>
          </div>
        ) : (
          <div key={current.id} className="specificQuestion">
            <h1 className="questionProper">{current.question}</h1>
            <div className="questionRow">
              <form className="answer" style={{"justify-content":"center", "width":"50%"}}>
                <input type="text" id="answer" name="answer"></input>
                <button type="submit" onClick={() => submitHandler()}>
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
