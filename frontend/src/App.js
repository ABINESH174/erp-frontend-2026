
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import CustomRouter from './Utility/CustomRouter'
import { Footer } from './Components';



function App() {
  return (
    <div>
      <CustomRouter/>
      <Footer/>
    </div>
  );
}

export default App;