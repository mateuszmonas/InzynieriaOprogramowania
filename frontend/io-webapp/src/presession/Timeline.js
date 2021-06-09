import React from "react"
import { Chrono } from "react-chrono";
import { FiArrowLeft } from "react-icons/fi";

import "./Timeline.css";
import "./Account.css"

const Timeline = ({ state, dispatch }) => {
  const FindQuestion = (questionId, timelineQuizzes) => {
    for (let i = 0; i < timelineQuizzes.length; ++i) {
      const quiz = timelineQuizzes[i];
      for (let j = 0; j < quiz.questions.length; ++j) {
        const question = quiz.questions[j];
        if (question.id === questionId)
          return [i, question.content, j === quiz.questions.length - 1];
      }
    }
    return [-1, "Unknown", false];
  }

  const ParseQuiz = (quiz, timelineQuizzes) => {
    timelineQuizzes.push(quiz);
    let quizData = [];

    quiz.questions.forEach((question, index) => {
      if (!question.open) {
        quizData.push("Question " + (index + 1) + ": " + question.content);
        question.answers.forEach(answer => {
          quizData.push("    - " + answer.text + (answer.correct ? " (correct)" : " (incorrect)"));
        });
      }
      else
        quizData.push("Question " + (index + 1) + ": " + question.content + " (open question)")
    });
    return quizData;
  }

  const ParseAnswers = (answers, sender, timelineQuizzes, timelineAnswerSets) => {
    const questionId = Object.keys(answers)[0];
    const metadata = FindQuestion(questionId, timelineQuizzes);
    const quizIdx = metadata[0];
    const questionTitle = metadata[1];
    const isLast = metadata[2];
    let idx = -1;

    for (let i = 0; i < timelineAnswerSets.length; ++i) {
      const answerSet = timelineAnswerSets[i];
      if (answerSet.sender === sender && answerSet.quizIdx === quizIdx) {
        idx = i;
        break;
      }
    }

    let answerInfo;
    if (idx === -1) {
      idx = timelineAnswerSets.length;
      answerInfo = {
        sender: sender,
        quizIdx: quizIdx,
        questionTitles: [questionTitle],
        answers: [answers[questionId]]
      };
    }
    else {
      answerInfo = {
        sender: sender,
        quizIdx: quizIdx,
        questionTitles: [...timelineAnswerSets[idx].questionTitles, questionTitle],
        answers: [...timelineAnswerSets[idx].answers, answers[questionId]]
      };
    }

    if (idx === -1)
      timelineAnswerSets.push(answerInfo);
    else
      timelineAnswerSets[idx] = answerInfo;

    if (isLast) {
      let text = [];
      for (let i = 0; i < answerInfo.questionTitles.length; ++i) {
        const title = answerInfo.questionTitles[i];
        const questionAnswers = answerInfo.answers[i];
        text.push("Question " + (i + 1) + ": " + title);
        for (let j = 0; j < questionAnswers.length; ++j) {
          const answer = questionAnswers[j];
          text.push("-> " + answer)
        }
      }

      const answerTimelineInfo = {
        title: "ANSWERS",
        cardTitle: sender,
        cardSubtitle: timelineQuizzes[quizIdx].name,
        cardDetailedText: text
      };

      timelineAnswerSets.splice(idx, 1);
      return answerTimelineInfo;
    }
  };

  const CountEmotes = (emote, timestamp, timelineEmoteInfo) => {
    if (timelineEmoteInfo.emotes.length === 0)
      timelineEmoteInfo.firstTimestamp = timestamp;
    timelineEmoteInfo.lastTimestamp = timestamp;

    const idx = timelineEmoteInfo.emotes.indexOf(emote);
    if (idx === -1) {
      timelineEmoteInfo.emotes.push(emote);
      timelineEmoteInfo.counts.push(1);
    }
    else timelineEmoteInfo.counts[idx]++;
  }

  const FlushEmotes = (timelineEmoteInfo) => {
    let text = [];
    for(let i = 0; i < timelineEmoteInfo.emotes.length; ++i)
      text.push(timelineEmoteInfo.emotes[i] + " x" + timelineEmoteInfo.counts[i]);
    const emoteInfo = {
      title: "EMOTES",
      cardTitle: "EMOTES",
      cardSubtitle: timelineEmoteInfo.firstTimestamp + " - " + timelineEmoteInfo.lastTimestamp,
      cardDetailedText: text
    };
    return emoteInfo;
  }

  const ParseMessage = (message, timelineQuizzes, timelineAnswerSets, timelineEmoteInfo) => {
    const contentJSON = JSON.parse(message.content);
    if (message.type !== "EMOTE" && timelineEmoteInfo.emotes.length > 0) {
      const res = FlushEmotes(timelineEmoteInfo);
      timelineEmoteInfo.emotes = [];
      timelineEmoteInfo.counts = [];
      timelineEmoteInfo.firstTimestamp = "";
      timelineEmoteInfo.lastTimestamp = "";
      return [res, ParseMessage(message, timelineQuizzes, timelineAnswerSets, timelineEmoteInfo)];
    }

    switch (message.type){
      case "COMMENT":
        return {
          title: "CHAT",
          cardTitle: message.sender,
          cardSubtitle: message.timestamp,
          cardDetailedText: contentJSON
        };
      case "QUIZ":
        return {
          title: "QUIZ",
          cardTitle: contentJSON.name,
          cardSubtitle: message.timestamp,
          cardDetailedText: ParseQuiz(contentJSON, timelineQuizzes)
        };
      case "QUIZ_ANSWERS":
        return ParseAnswers(contentJSON, message.sender, timelineQuizzes, timelineAnswerSets);
      case "EMOTE":
        CountEmotes(contentJSON, message.timestamp, timelineEmoteInfo);
    }
  };

  const CreateTimelineItems = (messageLog) => {
    let items = [];
    let timelineQuizzes = [];
    let timelineAnswerSets = [];
    let timelineEmoteInfo = {
      emotes: [],
      counts: [],
      firstTimestamp: "",
      lastTimestamp: ""
    };

    for (let i = 0; i < messageLog.length; ++i){
      const message = messageLog[i];
      const parsedMessage = ParseMessage(message, timelineQuizzes, timelineAnswerSets, timelineEmoteInfo);
      if (parsedMessage && Array.isArray(parsedMessage))
        items.push.apply(items, parsedMessage);
      else if (parsedMessage)
        items.push(parsedMessage);
    }
    if (timelineEmoteInfo.emotes.length > 0)
      items.push(FlushEmotes(timelineEmoteInfo));

    return items;
  }

  const ParseSessions = () => {
    return (
      <Chrono
        items={
          CreateTimelineItems(state
            .sessionHistory[state.pickedSession]
            .log
            .slice(1, state.sessionHistory[state.pickedSession].log.length))
        }
        theme={{primary: "grey", secondary: "yellow", cardBgColor: "#cccccc"}}
        mode="VERTICAL"
        useReadMore="true"
        hideControls="false"
        scrollable="true"
      />
    );
  };

  React.useEffect(() => {
    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/history", {
        method: "GET",
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch({
            type: "SET_SESSION_HISTORY",
            payload: data.sessions,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);
  return (
    <div className="quizListView">
      <div className="backButtonWrapper">
        <button
          type="button"
            onClick={(e) => {
              dispatch({ type: "SET_MESSAGE", payload: "" })
              dispatch({ type: "SET_STAGE_ACCOUNT" })
            }}
          className="submit"
        >
          Back <FiArrowLeft size={16}/>
        </button>
      </div>
      <div className="session-history-header">
        <h3>Session history</h3>
      </div>
      <div className="session-history-view">
        <div className="session-history-content">
          {state.sessionHistory.map((session, index) => {
            return (
              <div className="session-history-element">
                <button
                  className="session-history-button"
                  onClick={(e) => {
                    dispatch({type: "SET_PICKED_SESSION_IN_HISTORY", payload: index})
                  }}
                >
                  {session.title}
                </button>
              </div>
            );
          })}
        </div>

        <div className="session-timeline-content">
          {state.isSessionTimelineVisible ? (
            <div>
              <div className="session-title">
                <h2 className="session-title-text">{state.sessionHistory[state.pickedSession].title}</h2>
              </div>
              <div className="timeline-content">
                <ParseSessions/>
              </div>
            </div>
          ) : (
            <div className="session-title">
              <h2>Select session to view timeline</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timeline;