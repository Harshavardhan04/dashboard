export const generateContinuousData = (startDate, numDays) => {
    const continuousData = [];
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
  
    for (let i = 0; i < numDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
  
      continuousData.push({
        Date: formatDate(date),
        Target: parseFloat((Math.random() * 150 + 50).toFixed(2)),
        AUD: parseFloat((Math.random() * 100).toFixed(2)),
        EUR: parseFloat((Math.random() * 100).toFixed(2)),
        GBP: parseFloat((Math.random() * 100).toFixed(2)),
        JPY: parseFloat((Math.random() * 100).toFixed(2)),
        USD: parseFloat((Math.random() * 100).toFixed(2))
      });
    }
  
    return continuousData;
  };