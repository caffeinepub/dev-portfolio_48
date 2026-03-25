import Text "mo:core/Text";
import Order "mo:core/Order";
import List "mo:core/List";

actor {
  type Submission = {
    name : Text;
    email : Text;
    message : Text;
  };

  module Submission {
    public func compare(submission1 : Submission, submission2 : Submission) : Order.Order {
      switch (Text.compare(submission1.name, submission2.name)) {
        case (#equal) { Text.compare(submission1.email, submission2.email) };
        case (order) { order };
      };
    };
  };

  let allSubmissions = List.empty<Submission>();

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async () {
    let newSubmission = {
      name;
      email;
      message;
    };
    allSubmissions.add(newSubmission);
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    allSubmissions.toArray().sort();
  };
};
