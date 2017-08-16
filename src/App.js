import React, { Component } from "react";
import { gql, graphql, compose } from "react-apollo";

class App extends Component {
  handleCommentSubmit = (questionId, e) => {
    e.preventDefault();
    this.props.commentOnQuestion({
      variables: {
        questionId,
        text: e.target.comment.value
      }
    });
  };

  handlePickChoice = (questionId, choiceId) => {
    this.props.pickChoiceOnQuestion({
      variables: {
        questionId,
        choiceId
      }
    });
  };

  render() {
    const { questionData: { loading, questions } } = this.props;
    return (
      <main>
        <h3>Reproduction steps:</h3>
        <ol>
          <li>
            Type something in the input box, hit enter. ui gets updated
            correctly
          </li>
          <li>
            Click on "Good" choice button. ui gets updated correctly (because
            comment is already created)
          </li>
          <li>
            Refresh page. Click on "Good" choice button. ui gets updated wrongly
          </li>
        </ol>
        <p>
          The difference between mutation on input box vs choice button is that
          the choice mutation did not include comment data after mutation, which
          seems to result in error and `props.questionData.questions` becomes
          undefined.
          <p>
            <code>
              {`Can't find field comment on object (Answer:answer1) {
                "id": "answer1",
                "choice": {
                  "type": "id",
                  "id": "Choice:choice1",
                  "generated": false
                },
                "__typename": "Answer"
              }.`}
            </code>
          </p>
        </p>
        <h1>App</h1>
        {loading
          ? <p>Loading…</p>
          : <ul>
              {questions.map(question =>
                <li key={question.id}>
                  <strong>
                    {question.text}
                  </strong>
                  <div>
                    Comment:
                    {question.answer && question.answer.comment
                      ? question.answer.comment.text
                      : "Nothing yet"}
                    <form
                      onSubmit={this.handleCommentSubmit.bind(
                        null,
                        question.id
                      )}
                    >
                      <input name="comment" placeholder="comment" />
                    </form>
                  </div>
                  <div>
                    Response:
                    {question.answer && question.answer.choice
                      ? question.answer.choice.value
                      : "Nothing yet"}
                    <button
                      onClick={this.handlePickChoice.bind(
                        null,
                        question.id,
                        "choice1"
                      )}
                    >
                      Good
                    </button>
                    <button
                      onClick={this.handlePickChoice.bind(
                        null,
                        question.id,
                        "choice2"
                      )}
                    >
                      Not good
                    </button>
                  </div>
                </li>
              )}
            </ul>}
      </main>
    );
  }
}

export default compose(
  graphql(
    gql`
      {
        questions {
          id
          text
          answer {
            id
            comment {
              id
              text
            }
            choice {
              id
              value
            }
          }
        }
      }
    `,
    { name: "questionData" }
  ),
  graphql(
    gql`
      mutation Comment($questionId: String!, $text: String!) {
        CommentOnQuestion(questionId: $questionId, text: $text) {
          question {
            id
            answer {
              id
              choice {
                id
                value
              }
              comment {
                id
                text
              }
            }
          }
        }
      }
    `,
    {
      name: "commentOnQuestion"
    }
  ),
  graphql(
    gql`
      mutation PickChoice($questionId: String!, $choiceId: String!) {
        PickChoiceOnQuestion(questionId: $questionId, choiceId: $choiceId) {
          question {
            id
            answer {
              id
              choice {
                id
                value
              }
            }
          }
        }
      }
    `,
    {
      name: "pickChoiceOnQuestion"
    }
  )
)(App);
