import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { TagCloud } from "react-tagcloud";

import "./stats.css";

const Stats = ({ state, dispatch }) => {
  const [picked, setPicked] = React.useState(0);
  const [questions, setQuestions] = React.useState([]);

  const getStats = () => {
    (async () => {
      await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `/session/${state.sessionId}/statistics/answers`,
        {
          method: "GET",
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setQuestions(
            data.sessionAnswers.map((q) => {
              const dataReplies = [];
              for (let i = 0; i < q.question.answers.length; i++) {
                dataReplies.push({
                  answers: q.answerCounts[i],
                  name: q.question.answers[i].text,
                  isCorrect: q.question.answers[i].correct,
                });
              }

              return {
                content: q.question.content,
                answers: q.question.answers.map((answer) => {
                  return answer.text;
                }),
                replies: dataReplies,
                open: q.question.open,
              };
            })
          );
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

  React.useEffect(() => {
    const interval = setInterval(() => getStats(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="statsView">
      <div className="statsGraphPicker">
        <FiChevronLeft
          size={32}
          onClick={() =>
            setPicked((picked + questions.length) % questions.length)
          }
        />
        {questions.map((question, index) => {
          return (
            <div
              onClick={() => setPicked(index)}
              style={picked === index ? {} : { display: "none" }}
            >
              {question.content}
            </div>
          );
        })}
        <FiChevronRight
          size={32}
          onClick={() => setPicked((picked + 1) % questions.length)}
        />
      </div>

      {questions.length === 0 ? (
        <></>
      ) : questions[picked].open ? (
        <TagCloud
          style={{
            height: "100%",
            width: "95%",
            alignSelf: "center",
          }}
          minSize={12}
          maxSize={47}
          colorOptions={{
            luminosity: "dark",
            hue: "blue",
          }}
          shuffle={false}
          disableRandomColor={true}
          tags={questions[picked].replies
            .map((entry, index) => {
              let r = 0;
              let g = 0;
              let b = 0;

              for(let i = 0; i < questions[picked].answers[index].length; i++) {
                if (i % 3 === 0) {
                  r += questions[picked].answers[index].charCodeAt(i);
                } else if (i % 3 === 1) {
                  g += questions[picked].answers[index].charCodeAt(i);
                } else {
                  b += questions[picked].answers[index].charCodeAt(i);
                }
              }

              if (questions[picked].answers[index].length % 3 == 0) {
                r = (r % 128);
                g = 0;
                b = (b % 128);  
              } else if (questions[picked].answers[index].length % 3 == 1) {
                r = 0;
                g = (g % 128);
                b = (b % 128);  
              } else if (questions[picked].answers[index].length % 3 == 2) {
                r = 0;
                g = 0;
                b = (b % 128);  
              } else if (questions[picked].answers[index].length % 3 == 3) {
                r = 0;
                g = (g % 128);
                b = 0;  
              } else if (questions[picked].answers[index].length % 3 == 4) {
                r = (r % 128);
                g = 0;
                b = 0;  
              } else {
                r = (r % 128);
                g = (g % 128);
                b = 0; 
              }

              return {
                value: questions[picked].answers[index],
                count: entry.answers,
                color: `rgb(${r}, ${g}, ${b})`,
              };
            })
            .filter((entry) => entry.count && entry.count > 0)}
        />
      ) : (
        <ResponsiveContainer width="95%" height="90%">
          <BarChart data={questions[picked].replies}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="answers" fill="rgb(179, 144, 79)">
              {questions[picked].replies.map((entry, index) => (
                <Cell
                  fill={
                    questions[picked].replies[index].isCorrect
                      ? "rgb(146, 208, 80)"
                      : "rgb(192, 80, 77)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Stats;
