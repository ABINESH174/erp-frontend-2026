import './Landingpage.css';
import loginicon from '../../Assets/login1.svg';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import collegeimage from '../../Assets/landingclgimg.jpg'

function Landingpage() {
  const navigate = useNavigate();
  const goToLoginpage = () => navigate('/login-page');
  const features =[
    {title:'Student Registration',icon:'registration.png',image:'scholarshiphands.jpg',description:'Comprehensive student profiles with academic records, attendance,performance insights.'},
    {title:'Bonafide Request',icon:'online-profile.png',image:'scholarshiphands.jpg',description:'Bonafide request modulde helps students to apply for bonafide fully automated by submitting required documents.'},
  ]

  return (
    <div>
      <Header className='header-landingpage'/>
     
      <div className="landing-section">
         <nav className='landing-navbar'>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href='#features'>features</a></li>
        </ul>
      </nav>
        <section id='home'>
        <div className="clgimg-container">
          <img  src={collegeimage} alt="" />
            <h1 className="text-overimg">Smart ERP for Smarter Campus Management</h1>
            <p className="subhead-overimg">Streamline acadamics,administration, and comminication with one unified ERP software solution.</p>
            <div className="loginbnt"><button  onClick={goToLoginpage} image={loginicon}>Login</button></div> 
            <div className="card-overimg">
            </div>
        </div>
        </section>
        <section id='features'>
        <div className="landing-features">
          <h1>Powerful Features of ERP Software System</h1>
          <p className='features-description-para'>Our ERP system simplifies and automates daily institutional operations, enabling faculties, staffs, and students to make their work automate and easier.</p>
          <div className="erp-features-grid">
            {features.map(feature=>(
              <div className="outer-feature-box">
              <div className="erp-features-box" key={feature.id}>
                <img src={require(`../../Assets/${feature.icon}`)} alt="" className="icon-img" />
                <h3>{feature.title}</h3>
                <p className="module-description">{feature.description}</p>
                <img className='module-img' src={require(`../../Assets/${feature.image}`)}alt="image of registration module" />
              </div>
              </div>  
            ))}
          </div>
        </div>
        </section>

        
      </div>
    </div>
  );
}

export default Landingpage;