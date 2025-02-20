import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:slug" element={<PostDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
