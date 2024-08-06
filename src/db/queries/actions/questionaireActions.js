import gql from 'graphql-tag';

export const GET_QUESTIONAIRE = {
  name: 'getQuestionaire',
  query: gql`
    query getQuestionaire($name: String!) {
      getQuestionaire(name: $name) {
        id
        name
        questions {
          body
          order
          type
          skippable
          keepValue
          maxSelection
          extraJsonInfo
          options {
            title
            value
            order
            values
            resOptions {
              title
              value
            }
            subQuestionOptions {
              label
              options {
                name
                options {
                  title
                  value
                }
              }
            }
          }
        }
      }
    }
  `,
};

export const GET_QUESTIONAIRE_WITH_LOGS = {
  name: 'getQuestionaire',
  query: gql`
    query getQuestionaire($name: String!) {
      getQuestionaire(name: $name) {
        id
        name
        questions {
          body
          order
          type
          skippable
          keepValue
          maxSelection
          extraJsonInfo
          options {
            title
            value
            order
            values
            resOptions {
              title
              value
            }
            subQuestionOptions {
              label
              options {
                name
                options {
                  title
                  value
                }
              }
            }
          }
        }
      }
    }
  `,
};
