import React from "react";

const Question = ({ state, dispatch }) => { 
  const [questions, setQuestions] = React.useState([]);
  const [current, setCurrent] = React.useState(undefined);

  const [answer, setAnswer] = React.useState("");

  const updateQuestions = () => {
    let shift = questions.length !== 0;
    let newQuestions = questions;
    if (state.socket) {
      console.log(state)
      console.log(state.socket.type)
      while (state.socket.questions.length > 0)
        newQuestions.push(state.socket.questions.shift());
    }
    setQuestions(newQuestions);
    if (shift) questions.shift();
    setCurrent(questions[0]);
  };

  const submitHandler = (questionId, answerNumber) => {
    let answers = {}
    answers[questionId] = [answerNumber]
    const msg = {
      type: "quiz-answers",
      content: answers,
    };
    state.socket.sendMessage(msg);
    updateQuestions();
  };

  const submitHandler2 = (e, questionId) => {
    let answers = {}
    answers[questionId] = [answer]
    e.preventDefault();
    const msg = {
      type: "quiz-answers",
      content: answers,
    };
    state.socket.sendMessage(msg);
    updateQuestions();
    setAnswer("");
  };

  React.useEffect(() => {
    if (questions.length === 0) updateQuestions();
  }, [state.participants]);

  const changeHandler = (e) => {
    const { value } = e.target;
    setAnswer(value);
  };

  return (
    <div className="question" style={{ width: state.questionWidth }}>
      {state.awaitsApproval ? (
        <h1>Waiting for permission from room owner</h1>
      ) : current ? (
        !current.open ? (
          <div key={current.id} className="specificQuestion">
            <h1 className="questionProper">{current.content}</h1>
            <div className="questionRow">
              <div
                className="answer"
                onClick={(e) => submitHandler(current.id, 0)}
              >
                <h4>A:</h4>
                <p style={{ textIndent: "3px" }}>{current.answers[0].text}</p>
              </div>
            </div>
            <div className="questionRow">
              <div
                className="answer"
                onClick={(e) => submitHandler(current.id, 1)}
              >
                <h4>B:</h4>
                <p style={{ textIndent: "3px" }}>{current.answers[1].text}</p>
              </div>
            </div>
            <div className="questionRow">
              <div
                className="answer"
                onClick={(e) => submitHandler(current.id, 2)}
              >
                <h4>C:</h4>
                <p style={{ textIndent: "3px" }}>{current.answers[2].text}</p>
              </div>
            </div>
            <div className="questionRow">
              <div
                className="answer"
                onClick={(e) => submitHandler(current.id, 3)}
              >
                <h4>D:</h4>
                <p style={{ textIndent: "3px" }}>{current.answers[3].text}</p>
              </div>
            </div>
          </div>
        ) : (
          <div key={current.id} className="specificQuestion">
            <h1 className="questionProper">{current.content}</h1>
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
