export const UtilityService = {
    getAcademicYear : ()=>{
        const currentYear = new Date().getFullYear();
        const month = new Date().getMonth()+1;
        // If the current month is before June, the academic year starts in the previous year
        return month <= 7 ? `${currentYear - 1}-${currentYear}` : `${currentYear}-${currentYear + 1}`;
    },
    
}