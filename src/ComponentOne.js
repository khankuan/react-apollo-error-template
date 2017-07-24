import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import mergeWith from "lodash/mergeWith";

class ComponentOne extends Component {
  fetchMore = () => {
    return this.props.data.fetchMore({
      variables: {
        offset: this.props.data.people.length
      },
      updateQuery: (prev, { fetchMoreResult, ...extra }) => {
        const newResults = mergeWith(
          {},
          prev,
          fetchMoreResult,
          (objValue, srcValue) => {
            if (Array.isArray(objValue)) {
              return objValue.concat(srcValue);
            }
          }
        );
        return newResults;
      }
    });
  };

  render() {
    const { people, loading } = this.props.data;

    return (
      <div>
        <h1>
          Component One<button onClick={this.fetchMore} disabled={loading}>
            Fetch More
          </button>
        </h1>
        {people &&
          people.map(p =>
            <p key={p.id}>
              {p.name}
            </p>
          )}
      </div>
    );
  }
}

export default graphql(
  gql`
    query ComponentOne($offset: Int) {
      people(offset: $offset, limit: 1) {
        ...ComponentOneName
      }
    }

    fragment ComponentOneName on Person {
      id
      name
      email
    }
  `,
  {
    options: props => ({
      variables: {
        offset: 0
      }
    })
  }
)(ComponentOne);
