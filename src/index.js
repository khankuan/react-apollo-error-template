import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  IntrospectionFragmentMatcher
} from "react-apollo";
import App from "./App";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: "OBJECT",
          name: "Query",
          possibleTypes: null
        },
        {
          kind: "SCALAR",
          name: "Int",
          possibleTypes: null
        },
        {
          kind: "OBJECT",
          name: "Person",
          possibleTypes: null
        },
        {
          kind: "SCALAR",
          name: "ID",
          possibleTypes: null
        },
        {
          kind: "SCALAR",
          name: "String",
          possibleTypes: null
        },
        {
          kind: "OBJECT",
          name: "__Schema",
          possibleTypes: null
        },
        {
          kind: "OBJECT",
          name: "__Type",
          possibleTypes: null
        },
        {
          kind: "ENUM",
          name: "__TypeKind",
          possibleTypes: null
        },
        {
          kind: "SCALAR",
          name: "Boolean",
          possibleTypes: null
        },
        {
          kind: "OBJECT",
          name: "__Field",
          possibleTypes: null
        },
        {
          kind: "OBJECT",
          name: "__InputValue",
          possibleTypes: null
        },
        {
          kind: "OBJECT",
          name: "__EnumValue",
          possibleTypes: null
        },
        {
          kind: "OBJECT",
          name: "__Directive",
          possibleTypes: null
        },
        {
          kind: "ENUM",
          name: "__DirectiveLocation",
          possibleTypes: null
        }
      ]
    }
  }
});

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: "https://mzvzpjrn9.lp.gql.zone/graphql"
  }),
  fragmentMatcher
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
