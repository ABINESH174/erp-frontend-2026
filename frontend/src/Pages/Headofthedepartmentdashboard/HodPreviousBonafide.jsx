// import React, { useEffect, useState } from 'react'
// import AxiosInstance from '../../Api/AxiosInstance'
// import { toast } from 'react-toastify'
// import { useLocation } from 'react-router-dom'

// const HodPreviousBonafide = () => {
//     const location = useLocation();
//     const [previousBonafideData, setPreviousBonafideData] = useState();
//     const hodId = location.state.userId;
    

//     useEffect(()=>{
//      const PreviousBonafideInHodPage=async() =>{
//         try {
//            const response =  await AxiosInstance.get(`/bonafide/hod/previousBonafide/${hodId}`);
//            setPreviousBonafideData(response.data);
//            console.log(response.data);

//         } catch (error) {
//             toast.error("Error Fetching Previous Bonafides")
//             console.log(error);
//         }
//     }
// },[]);

    
//   return (
//     <div>
//         <table>
//           <thead>
//             <tr>
//             </tr>
//           </thead>
//         </table>
//     </div>
//   )
// }

// export default HodPreviousBonafide