import React from "react";

import "./Account.css";

const QuestionList = ({ state, dispatch }) => {
  const [picked, setPicked] = React.useState(0);

  const onLoad = (e) => {
    e.preventDefault();

    (async () => {
      await fetch("http://localhost:8080/quiz", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

  const onCreate = (e) => {
    e.preventDefault();

    (async () => {
      await fetch("http://localhost:8080/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "questions": [
              {
                "id": "1",
                "content": "What is my name?",
                "answers": [
                  {
                    "text": "wah",
                    "correct": true
                  }
                ]
              }
            ]
          }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

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
  ];

  return (
    <div className="questionPicker">
      <div
        onClick={() => setPicked(0)}
        className={picked === 0 ? "picked" : "notPicked"}
      >
        All Questions
      </div>
      {sampleQuestions.map((question) => {
        return (
          <div
            onClick={(e) => {
              setPicked(question.id);
              onCreate(e);
            }}
            className={picked === question.id ? "picked" : "notPicked"}
          >
            Question {question.id}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
