import React from 'react'
import { ReactElement } from './ReactElement'

interface IProps {
    age: number;
    name: string;
}

class Person extends React.Component<IProps> {
    render = () => <div><b>{this.props.name}</b> is <b>{this.props.age}</b> years young.</div>;
}

ReactElement.register(Person, "re-person", ["age", "name"], {
    age: parseInt
});
