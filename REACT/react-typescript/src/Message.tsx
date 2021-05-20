import React from 'react';
import messageHOC from './HOC';


const example = (props: any): any => <p>{props.name}, {props.message}</p>

const Message = messageHOC(example);

export default Message;