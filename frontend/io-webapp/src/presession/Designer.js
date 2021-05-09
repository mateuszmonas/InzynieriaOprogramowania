import React from 'react';
import Creator from "../session/Creator";
import QuestionList from "./QuestionList";

import "./Account.css";

const Designer = ({state, dispatch}) => {
    return (
        <div className="designer">
            <Creator state={state} dispatch={dispatch}/>
            <QuestionList state={state} dispatch={dispatch}/>
        </div>
    )
}

export default Designer
