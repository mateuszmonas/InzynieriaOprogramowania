import Socket from "./socket";
import {getParticipantsHandler, getSessionHistoryHandler} from "./endpointHandlers";
import {act} from "react-dom/test-utils";

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
  isSessionHistoryVisible: false,
  questionWidth: "100%",
  sessionOwner: "",
  participants: [],
  sessionHistory: [],
  isStatsVisible: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STAGE_START":
      console.log(state);
      return { ...state, stage: "start", awaitsApproval: false };
    case "SET_STAGE_ACCOUNT":
      console.log(state);
      return { ...state, stage: "account", awaitsApproval: false };
    case "SET_STAGE_STUDENT":
      console.log(state);
      return { ...state, stage: "student", awaitsApproval: false };
    case "SET_STAGE_STUDENT_NEEDS_APPROVAL":
      console.log(state);
      return { ...state, stage: "student", awaitsApproval: true };
    case "SET_STAGE_GUEST":
      console.log(state);
      return { ...state, stage: "guest", awaitsApproval: false };
    case "SET_STAGE_GUEST_NEEDS_APPROVAL":
      console.log(state);
      return { ...state, stage: "guest", awaitsApproval: true };
    case "SET_STAGE_LECTURER":
      console.log(state);
      return { ...state, stage: "lecturer", awaitsApproval: false, isStatsVisible: false };
    case "SET_STAGE_SIGNUP":
      console.log(state);
      return { ...state, stage: "signUp", awaitsApproval: false };
    case "SET_STAGE_LOGIN":
      console.log(state);
      return { ...state, stage: "login", awaitsApproval: false };
    case "SET_STATE_SESSION_HISTORY": console.log(state)
      return { ...state, stage: "account", awaitsApproval: false}

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

    case "SET_SESSION_HISTORY":
      return { ...state, sessionHistory: action.payload };

    case "CHAT_VISIBLE":
      return {
        ...state,
        isChatVisible: true,
        isParticipantsVisible: false,
        isSessionHistoryVisible: false,
        questionWidth: "75%",
      };
    case "PARTICIPANTS_VISIBLE": {
      getParticipantsHandler(
        action.payload.e,
        action.payload.state,
        action.payload.dispatch
      );
      return {
        ...state,
        isChatVisible: false,
        isParticipantsVisible: true,
        isSessionHistoryVisible: false,
        questionWidth: "75%",
      };
    }
    case "SESSION_HISTORY_VISIBLE": {
      getSessionHistoryHandler(
          action.payload.e,
          action.payload.state,
          action.payload.dispatch
      );
      return {
        ...state,
        isChatVisible: false,
        isParticipantsVisible: false,
        isSessionHistoryVisible: true
      }
    }
    case "NOTHING_VISIBLE":
      return {
        ...state,
        isChatVisible: false,
        isParticipantsVisible: false,
        isSessionHistoryVisible: false,
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

    default:
      throw new Error();
  }
};
