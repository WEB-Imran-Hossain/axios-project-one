import { useEffect, useState } from "react";
import "./App.css";
import api from "./api/api";
import AddPost from "./components/AddPost.jsx";
import EditPost from "./components/EditPost.jsx";
import Posts from "./components/Posts";
import axios from "axios";
// import initialPosts from "./data/db.js";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null); // post I am editing
  const [error, setError] = useState(null);

  //handle   new post /adding
  const handleAddPost = async (newPost) => {
    try {
      const id = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;

      const finalPost = {
        id: id.toString(),
        ...newPost,
      };

      const response = await axios.post(
        "http://localhost:8000/posts",
        finalPost
      );

      setPosts([...posts, response.data]);
    } catch (err) {
      if (err.response) {
        //error came from server
        setError(
          `Error from server: status: ${err.response.status} - message: ${err.response.data}`
        );
      } else {
        //network error, did not reach to server
        setError(err.message);
      }
    }
  };

  //handle delete for post
  const handleDeletePost = async (postId) => {
    if (confirm("Are you sure you want to delete the post?")) {
      try {
        await axios.delete(`http://localhost:8000/posts/${postId}`);
        const newPosts = posts.filter((post) => post.id !== postId);
        setPosts(newPosts);
      } catch (err) {
        if (err.response) {
          //error came from server
          setError(
            `Error from server: status: ${err.response.status} - message: ${err.response.data}`
          );
        } else {
          //network error, did not reach to server
          setError(err.message);
        }
      }
    }
  }

  const handleEditPost = async (updatedPost) => {
    try {
      const response = await api.patch(`/posts/${updatedPost.id}`, updatedPost);

      const updatedPosts = posts.map((post) =>
        post.id === response.data.id ? response.data : post
      );

      setPosts(updatedPosts);
    } catch (err) {
      setError(err.message);
    }
  };

  // without axios for data fetching
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await api.get("/posts");

  //       if (response && response.data) {
  //         setPosts(response.data);
  //       }
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  // using axios for data fetching
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/posts");
        if (response && response.data) {
          setPosts(response.data);
        }
      } catch (err) {
        if (err.response) {
          //error came from server
          setError(
            `Error from server: status: ${err.response.status} - message: ${err.response.data}`
          );
        } else {
          //network error, did not reach to server
          setError(err.message);
        }
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <div>
        <h1>API Request with Axios</h1>
        <hr />

        <div>
          <Posts
            posts={posts}
            onDeletePost={handleDeletePost}
            onEditClick={setPost}
          />

          <hr />

          {!post ? (
            <AddPost onAddPost={handleAddPost} />
          ) : (
            <EditPost post={post} onEditPost={handleEditPost} />
          )}

          {error && (
            <>
              <hr />
              <div className="error">{error}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
