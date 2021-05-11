import Socket from "./socket";
import { getParticipantsHandler } from "./endpointHandlers";

export const initialState = {
  stage: "start",
  awaitsApproval: false,
  username: "",
  token: "",
  sessionId: "",
  sessionTitle: "",
  guestId: "",
  socket: undefined,
  approvalSocket: undefined,
  approvalRoomId: "",
  message: "",
  isChatVisible: false,
  isParticipantsVisible: false,
  questionWidth: "100%",
  sessionOwner: "",
  participants: [],
  isStatsVisible: false,
  designerQuestions: [],
  pickedQuestion: -1,
  quizList: [],
  quizName: "",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STAGE_START":
      return { ...state, stage: "start", awaitsApproval: false };
    case "SET_STAGE_ACCOUNT":
      return {
        ...state,
        stage: "account",
        awaitsApproval: false,
        questionWidth: "100%",
      };
    case "SET_STAGE_STUDENT":
      return { ...state, stage: "student", awaitsApproval: false };
    case "SET_STAGE_STUDENT_NEEDS_APPROVAL":
      return { ...state, stage: "student", awaitsApproval: true };
    case "SET_STAGE_GUEST":
      return { ...state, stage: "guest", awaitsApproval: false };
    case "SET_STAGE_GUEST_NEEDS_APPROVAL":
      return { ...state, stage: "guest", awaitsApproval: true };
    case "SET_STAGE_LECTURER":
      return {
        ...state,
        stage: "lecturer",
        awaitsApproval: false,
        isStatsVisible: false,
      };
    case "SET_STAGE_SIGNUP":
      return { ...state, stage: "signUp", awaitsApproval: false };
    case "SET_STAGE_LOGIN":
      return { ...state, stage: "login", awaitsApproval: false };
    case "SET_STAGE_DESIGNER":
      return {
        ...state,
        stage: "designer",
        awaitsApproval: false,
        questionWidth: "75%",
        pickedQuestion: -1,
      };
    case "SET_STAGE_QUIZ_LIST":
      return {
        ...state,
        stage: "quizList",
        awaitsApproval: false,
        questionWidth: "100%",
      };

    case "SET_USERNAME":
      return { ...state, username: action.payload };

    case "SET_TOKEN":
      return { ...state, token: action.payload };

    case "SET_SESSION_ID":
      return { ...state, sessionId: action.payload };

    case "SET_SESSION_TITLE":
      return { ...state, sessionTitle: action.payload };

    case "SET_GUEST_ID":
      return { ...state, guestId: action.payload };

    case "SET_SOCKET":
      return { ...state, socket: action.payload };

    case "SET_APPROVAL_SOCKET":
      return { ...state, approvalSocket: action.payload };

    case "SET_APPROVAL_ROOM_ID":
      return { ...state, approvalRoomId: action.payload };

    case "SET_MESSAGE":
      return { ...state, message: action.payload };

    case "CHAT_VISIBLE":
      return {
        ...state,
        isChatVisible: true,
        isParticipantsVisible: false,
        questionWidth: "75%",
      };
    case "TOGGLE_PARTICIPANTS_VISIBLE": {
      return {
        ...state,
        isParticipantsVisible: !state.isParticipantsVisible,
      };
    }
    case "NOTHING_VISIBLE":
      return {
        ...state,
        isChatVisible: false,
        isParticipantsVisible: false,
        questionWidth: "100%",
      };

    case "SET_SESSION_OWNER":
      return { ...state, sessionOwner: action.payload };

    case "SET_PARTICIPANTS":
      return { ...state, participants: action.payload };

    case "SET_STATS_VISIBLE":
      return { ...state, isStatsVisible: true };
    case "SET_CREATOR_VISIBLE":
      return { ...state, isStatsVisible: false };

    case "ADD_DESIGNER_QUESTION":
      return {
        ...state,
        designerQuestions: [...state.designerQuestions, action.payload],
      };
    case "SET_DESIGNER_QUESTIONS":
      return { ...state, designerQuestions: action.payload };
    case "UPDATE_DESIGNER_QUESTION":
      return {
        ...state,
        designerQuestions: [
          ...state.designerQuestions.slice(0, action.payload.index),
          action.payload.question,
          ...state.designerQuestions.slice(
            action.payload.index + 1,
            state.designerQuestions.length
          ),
        ],
      };
      case "DELETE_DESIGNER_QUESTION":
        return {
          ...state,
          designerQuestions: [
            ...state.designerQuestions.slice(0, action.payload),
            ...state.designerQuestions.slice(
              action.payload + 1,
              state.designerQuestions.length
            ),
          ],
        };
  

    case "SET_PICKED_QUESTION":
      return { ...state, pickedQuestion: action.payload };

    case "SET_QUIZ_LIST":
      return { ...state, quizList: action.payload };

    case "SET_QUIZ_NAME":
      return { ...state, quizName: action.payload };

    default:
      throw new Error();
  }
};
