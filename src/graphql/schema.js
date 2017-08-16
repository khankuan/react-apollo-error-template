import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} from "graphql";

//  Types
const ChoiceType = new GraphQLObjectType({
  name: "Choice",
  fields: {
    id: { type: GraphQLID },
    value: { type: GraphQLString }
  }
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: {
    id: { type: GraphQLID },
    text: { type: GraphQLString }
  }
});

const AnswerType = new GraphQLObjectType({
  name: "Answer",
  fields: {
    id: { type: GraphQLID },
    choice: { type: ChoiceType },
    comment: { type: CommentType }
  }
});

const QuestionType = new GraphQLObjectType({
  name: "Question",
  fields: {
    id: { type: GraphQLID },
    text: { type: GraphQLString },
    answer: { type: AnswerType }
  }
});

const CommentOnQuestionType = new GraphQLObjectType({
  name: "CommentOnQuestion",
  fields: {
    answer: { type: AnswerType },
    question: { type: QuestionType }
  }
});

const PickChoiceOnQuestionType = new GraphQLObjectType({
  name: "PickChoiceOnQuestion",
  fields: {
    answer: { type: AnswerType },
    question: { type: QuestionType }
  }
});

//  Data
let db;

function makeObj(type, data = {}) {
  return {
    id: `${type.toLowerCase()}${Object.keys(db[type]).length + 1}`,
    ...data
  };
}

function commentOnQuestion(questionId, text) {
  const comment = makeObj("Comment", { text });
  const answer = db.Question[questionId].answer || makeObj("Answer");
  answer.comment = comment;
  db.Question[questionId].answer = answer;
  return answer;
}

function pickChoiceOnQuestion(questionId, choiceId) {
  const answer = db.Question[questionId].answer || makeObj("Answer");
  answer.choice = db.Choice[choiceId];
  db.Question[questionId].answer = answer;
  return answer;
}

function resetDb() {
  db = {
    Question: {
      question1: { id: "question1", text: "How are you?" }
    },
    Answer: {},
    Comment: {},
    Choice: {
      choice1: { id: "choice1", value: "Good" },
      choice2: { id: "choice2", value: "Not good" }
    }
  };
}
resetDb();
window.resetDb = resetDb;

//  Schema
const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    questions: {
      type: new GraphQLList(QuestionType),
      resolve: () => Object.values(db.Question)
    }
  }
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    CommentOnQuestion: {
      type: CommentOnQuestionType,
      args: {
        questionId: { type: GraphQLString },
        text: { type: GraphQLString }
      },
      resolve: (root, args) => {
        return {
          answer: commentOnQuestion(args.questionId, args.text),
          question: db.Question[args.questionId]
        };
      }
    },
    PickChoiceOnQuestion: {
      type: PickChoiceOnQuestionType,
      args: {
        questionId: { type: GraphQLString },
        choiceId: { type: GraphQLString }
      },
      resolve: (root, args) => {
        return {
          answer: pickChoiceOnQuestion(args.questionId, args.choiceId),
          question: db.Question[args.questionId]
        };
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
