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
