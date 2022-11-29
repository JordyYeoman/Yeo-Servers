const ObjectId = require("mongoose").Types.ObjectId;

// Checks to validate incoming id query strings as mongodb id
export function isValidObjectId(id: string): boolean {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}
