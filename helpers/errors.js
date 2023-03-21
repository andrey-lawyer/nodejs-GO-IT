class ContactsError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ValidationError extends ContactsError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class NotAuthorizedError extends ContactsError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

class ConflictAuthorizedError extends ContactsError {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

class FileError extends ContactsError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

module.exports = {
  ContactsError,
  ValidationError,
  NotAuthorizedError,
  ConflictAuthorizedError,
  FileError,
};
