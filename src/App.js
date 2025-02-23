import React, { useState, useEffect } from "react";

const App = () => {
  const [subreddit, setSubreddit] = useState("");
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchPosts = async () => {
    if (!subreddit) return;
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`
      );
      const data = await response.json();
      setPosts(data.data.children.map((child) => child.data));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const addFavorite = (post) => {
    if (!favorites.some((fav) => fav.id === post.id)) {
      setFavorites([...favorites, post]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((post) => post.id !== id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Reddit Favorites</h1>
      <input
        type="text"
        placeholder="Enter subreddit"
        value={subreddit}
        onChange={(e) => setSubreddit(e.target.value)}
      />
      <button onClick={fetchPosts}>Fetch Posts</button>
      
      <h2>Posts from r/{subreddit}</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a> ({post.score} points)
            <button onClick={() => addFavorite(post)}>Add to Favorites</button>
          </li>
        ))}
      </ul>

      <h2>Favorites</h2>
      <ul>
        {favorites.map((post) => (
          <li key={post.id}>
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a> ({post.score} points)
            <button onClick={() => removeFavorite(post.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
