import React from "react";

import "./Account.css";

const QuizList = ({ state, dispatch }) => {
  const [picked, setPicked] = React.useState(0);

  const sampleQuestions = [
    {
      id: 1,
      question: "What's the first letter of the alphabet?",
      answers: ["A", "D", "F", "P"],
      replies: [
        { answers: 3, name: "A", isCorrect: false },
        { answers: 8, name: "B", isCorrect: true },
        { answers: 2, name: "C", isCorrect: false },
        { answers: 2, name: "D", isCorrect: false },
      ],
    },
    {
      id: 2,
      question: "What colour is the water in Cracow?",
      answers: ["Green", "Blue", "Black", "Brown"],
      replies: [
        { answers: 7, name: "A", isCorrect: true },
        { answers: 6, name: "B", isCorrect: false },
        { answers: 3, name: "C", isCorrect: false },
        { answers: 12, name: "D", isCorrect: true },
      ],
    },
    {
      id: 3,
      question: "A?",
    },
    {
      id: 4,
      question: "A?",
    },
    {
      id: 5,
      question: "A?",
    },
    {
      id: 6,
      question: "A?",
    },
    {
      id: 7,
      question: "A?",
    },
    {
      id: 8,
      question: "A?",
    },
    {
      id: 9,
      question: "A?",
    },
    {
      id: 10,
      question: "A?",
    },
  ];

  return (
    <div className="quizList">
    <div className="addQuiz">
      <button type="button" onClick={() => {dispatch({type: "SET_STAGE_DESIGNER"})}}>Add New Quiz</button>
    </div>
      <div
        onClick={() => setPicked(0)}
        className="quizInList"
      >
        All Questions
      </div>
      {sampleQuestions.map((question) => {
        return (
          <div
            onClick={(e) => {
              setPicked(question.id);
            }}
            className="quizInList"
          >
            Question {question.id}
          </div>
        );
      })}
    </div>
  );
};

export default QuizList;