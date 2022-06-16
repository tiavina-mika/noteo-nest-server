import { GraphQLError } from 'graphql';
// {
//   "errors": [
//     {
//       "message": "Email already exits"
//     }
//   ],
//   "data": null
// }

export const formatGraphQLErrorMessage = (graphqlError: GraphQLError) => {
  if (graphqlError.message.startsWith('E11000')) {
    return 'Email already exits';
  }

  return null;
};
