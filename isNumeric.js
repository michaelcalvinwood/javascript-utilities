
function isNumeric(val) {
    
    return !isNaN(val.toString()) && 
           !isNaN(parseFloat(val.toString()))
  }