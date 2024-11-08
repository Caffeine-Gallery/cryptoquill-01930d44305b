import Int "mo:base/Int";
import Text "mo:base/Text";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Order "mo:base/Order";

actor {
    // Post type definition
    type Post = {
        title: Text;
        content: Text;
        author: Text;
        timestamp: Int;
    };

    // Store posts in a stable variable
    stable var posts : [Post] = [];

    // Create a new post
    public func createPost(title: Text, content: Text, author: Text) : async () {
        let newPost : Post = {
            title = title;
            content = content;
            author = author;
            timestamp = Time.now();
        };

        // Create a buffer from the stable array
        let buffer = Buffer.fromArray<Post>(posts);
        // Add the new post
        buffer.add(newPost);
        // Convert back to array and store
        posts := Buffer.toArray(buffer);
    };

    // Get all posts in reverse chronological order
    public query func getPosts() : async [Post] {
        let buffer = Buffer.fromArray<Post>(posts);
        // Sort posts by timestamp in descending order
        buffer.sort(func (a: Post, b: Post) : Order.Order {
            if (a.timestamp > b.timestamp) { #less }
            else if (a.timestamp < b.timestamp) { #greater }
            else { #equal }
        });
        Buffer.toArray(buffer)
    };
}
