import React, {Component} from 'react'

const initialState = {
    name: "Manny",
    message: "TypeScript is cool."
  }

type State = Readonly<typeof initialState>;

const messageHOC = (WrappedComponent: any) => {
    class HOC extends Component<{}, State> {
        readonly state: State = initialState

        render() {
            return(
                <WrappedComponent name={this.state.name} message={this.state.message} />
            )
        }
    }
    return HOC;
}

export default messageHOC;