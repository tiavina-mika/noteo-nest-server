/**
 * transform the default MongoDB "_id" field to "id"
 * @param document
 * @param returnedObject
 */
export const transformMongoDBIdentifier = (document, returnedObject) => {
  returnedObject.id = returnedObject._id.toString();
  delete returnedObject._id;
  delete returnedObject.__v;
};

export const validateEmail = (email: string) => {
  const expression =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return expression.test(email);
};
