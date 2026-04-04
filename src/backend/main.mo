import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

actor {
  type Document = {
    id : Text;
    owner : Principal;
    title : Text;
    content : Text;
    formatType : Text;
    lastEdited : Int;
  };

  type DocumentMeta = {
    id : Text;
    owner : Principal;
    title : Text;
    formatType : Text;
    lastEdited : Int;
  };

  module DocumentMeta {
    public func compare(meta1 : DocumentMeta, meta2 : DocumentMeta) : Order.Order {
      switch (Int.compare(meta2.lastEdited, meta1.lastEdited)) {
        case (#equal) { Text.compare(meta1.title, meta2.title) };
	      case (order) { order };
      };
    };
  };

  let documents = Map.empty<Text, Document>();

  // Create a new document
  public shared ({ caller }) func createDocument(id : Text, title : Text, content : Text, formatType : Text) : async () {
    if (documents.containsKey(id)) { Runtime.trap("Document with this ID already exists.") };
    let document : Document = {
      id;
      owner = caller;
      title;
      content;
      formatType;
      lastEdited = Time.now();
    };
    documents.add(id, document);
  };

  // Get full document
  public query ({ caller }) func getDocument(id : Text) : async Document {
    switch (documents.get(id)) {
      case (null) { Runtime.trap("Document not found") };
      case (?document) {
        if (document.owner != caller) {
          Runtime.trap("Unauthorized access");
        };
        document;
      };
    };
  };

  // Get document metadata (no content)
  public query ({ caller }) func getDocumentMeta(id : Text) : async DocumentMeta {
    switch (documents.get(id)) {
      case (null) { Runtime.trap("Document not found") };
      case (?document) {
        {
          id = document.id;
          owner = document.owner;
          title = document.title;
          formatType = document.formatType;
          lastEdited = document.lastEdited;
        };
      };
    };
  };

  // Update document content and title
  public shared ({ caller }) func updateDocument(id : Text, title : Text, content : Text) : async () {
    switch (documents.get(id)) {
      case (null) { Runtime.trap("Document not found") };
      case (?document) {
        if (document.owner != caller) {
          Runtime.trap("Unauthorized update");
        };
        let updatedDocument : Document = {
          id = document.id;
          owner = document.owner;
          title;
          content;
          formatType = document.formatType;
          lastEdited = Time.now();
        };
        documents.add(id, updatedDocument);
      };
    };
  };

  // Delete document
  public shared ({ caller }) func deleteDocument(id : Text) : async () {
    switch (documents.get(id)) {
      case (null) { Runtime.trap("Document not found") };
      case (?document) {
        if (document.owner != caller) {
          Runtime.trap("Unauthorized delete");
        };
        documents.remove(id);
      };
    };
  };

  // List all document metadata for caller
  public query ({ caller }) func getAllDocumentsMeta() : async [DocumentMeta] {
    documents.values().toArray().map(
      func(doc) {
        {
          id = doc.id;
          owner = doc.owner;
          title = doc.title;
          formatType = doc.formatType;
          lastEdited = doc.lastEdited;
        };
      }
    ).filter(func(meta) { meta.owner == caller }).sort();
  };
};
