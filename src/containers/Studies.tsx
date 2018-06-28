import * as React from 'react';
import './styles/Login.css';

interface StudiesProps {
};

class Studies extends React.Component<StudiesProps, any> {
  public constructor(props: StudiesProps) {
    super(props);

    this.state = {
      
    };
  }

  public render() {
    return (
      <div className="Studies">
        This page should be blocked by a redirect until the user signs in.
      </div>
    );
  }
}

export default Studies;