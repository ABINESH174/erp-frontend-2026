import './Landingpage.css';
import loginicon from '../../Assets/login1.svg';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import clglogo from '../../Assets/clglogo.png'
import TNlogo from '../../Assets/tamilnadulogos.png'
import collegeimage from '../../Assets/landingclgimg.jpg'
import acadamics from '../../Assets/acadamics.png'
import education from '../../Assets/education.png'
import sports from '../../Assets/sports.png'
import students from '../../Assets/thinking.png'


function Landingpage() {
  const navigate = useNavigate();
  const goToLoginpage = () => navigate('/login-page');
  const features = [
    { title: 'Student Registration', icon: 'registration.png', image: 'scholarshiphands.jpg', description: 'Comprehensive student profiles with academic records, attendance,performance insights.' },
    { title: 'Bonafide Request', icon: 'online-profile.png', image: 'scholarshiphands.jpg', description: 'Bonafide request modulde helps students to apply for bonafide fully automated by submitting required documents.' },
  ]

  return (
    <div>
      {/* <Header className='header-landingpage'/> */}

      {/* <header className='landing-header'>
         <div>
          <img class="clglogo" src={clglogo} alt="collegelogo"/>
          </div>
          <div class="clg-name">
          <h2 id="college_name">Alagappa Chettiar Government College of Engineering and Technology,Karaikudi-630003</h2>
                <p class="college_description">(An Autonomous Institution Permanently Affiliated to Anna University)</p>
                </div>
                <div>
                  <img src={TNlogo} alt="" className="tamilnadu-logo" />
        </div>
      </header> */}


      <div className="landing-section">
        <section id='home'>
          <div className="clgimg-container">

            <img src={collegeimage} alt="" />
            <div className="landing-header-section">
              <div class="landing-clglogo">
                <img src={clglogo} alt="collegelogo" />
              </div>
              <div class="landing-clg-name">
                <h2>Alagappa Chettiar Government College of Engineering and Technology,Karaikudi-630003</h2>
                <p class="college_description">(An Autonomous Institution Permanently Affiliated to Anna University)</p>
              </div>
              <div className="landing-tamilnadu-logo">
                <img src={TNlogo} alt="" />
              </div>
            </div>
            <div className="navbar-button">
              <ul className='navbar-list'>
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#missions">Missions</a></li>
                <li><button  onClick={goToLoginpage}>Login</button></li>
              </ul>
            </div>
            <div className="landing-heading-para">
              <h1>Smart ERP for Smarter Campus Management</h1>
              <p>Streamline acadamics,administration, and comminication with one unified ERP software solution.</p>
            </div>

            <div className="floating-obj">
              <div className='float-images-up'><img src={acadamics} alt="" /><p>Acadamics</p></div>
             <div className='float-images-down'><img src={students} alt="" /><p>Students</p></div> 
             <div className='float-images-up'><img src={education} alt="" /><p>Educations</p></div> 
              <div className='float-images-down'><img src={sports} alt="" /><p>Sports</p></div> 
            </div>
          </div>
        </section>
        <section id='features'>
          <div className="landing-features">
            <h1>Powerful Features of ERP Software System</h1>
            <p className='features-description-para'>Our ERP system simplifies and automates daily institutional operations, enabling faculties, staffs, and students to make their work automate and easier.</p>
            <div className="erp-features-grid">
              {features.map(feature => (
                <div className="outer-feature-box">
                  <div className="erp-features-box" key={feature.id}>
                    <img src={require(`../../Assets/${feature.icon}`)} alt="" className="icon-img" />
                    <h3>{feature.title}</h3>
                    <p className="module-description">{feature.description}</p>
                    <img className='module-img' src={require(`../../Assets/${feature.image}`)} alt="image of registration module" />
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