import logo from './logo.svg';
import './App.css';

import Gallery from './components/Gallery';

import Register from './components/Register';

import Nav from './components/Navigation';
import UploadPage from './components/MintNft';
import Profile from './components/Profile';





function App() {
  return (
    <div className="App">
      <Nav />
      <Gallery />
      <Register />
      <UploadPage  />
      <Profile />
    </div>
  );
}

export default App;
