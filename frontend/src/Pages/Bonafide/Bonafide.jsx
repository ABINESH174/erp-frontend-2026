import React, { useState } from 'react';
import './Bonafide.css';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';

function Bonafide() {
    const [displaySection, setDisplaySection] = useState("");

    const handleSectionChange = (event) => {
        setDisplaySection(event.target.value);
    };

    return (
        <div>
            <Header />
            <div>
                <p>Select an option:</p>
                <select id="two" onChange={handleSectionChange}>
                    <option value="" selected disabled>Select</option>
                    <option value="Scholarship">Bonafide for Scholarship</option>
                    <option value="Buspass">Bonafide for Buspass</option>
                </select>
            </div>

            <div>
                {displaySection === "Scholarship" && (
                    <div>
                        <select id="two" onChange={handleSectionChange}>
                            <option value="" selected disabled>Select</option>
                            <option value="Labour Welfare Scholarship ">Bonafide for Scholarship</option>
                            <option value="Pragati">Bonafide for Buspass</option>
                         </select>
                    </div>
                )}

                {displaySection === "Buspass" && (
                    <div>
                       
                    </div>
                )}
            </div>
            <Footer  />
        </div>
    );
}

export default Bonafide;