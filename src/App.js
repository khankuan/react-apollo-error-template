import React, { Component } from "react";

import ComponentOne from "./ComponentOne";
import ComponentTwo from "./ComponentTwo";

class App extends Component {
  render() {
    return (
      <main>
        <header>
          <h1>Apollo Client Error Template</h1>
          <p>
            To reproduce: Click on the first fetch more button. Notice that the
            second list gets updated as well.
          </p>
        </header>
        <ComponentOne />
        <ComponentTwo />
      </main>
    );
  }
}

export default App;
