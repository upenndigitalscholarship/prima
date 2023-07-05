function logData(filters, fiveResults) {
    console.log(fiveResults);
    console.log(filters);
        
  }
  
  async function asyncCall() {
    const pagefind = await import("/_pagefind/pagefind.js");
    const filters = await pagefind.filters();
    const search = await pagefind.search("Prima");
    const fiveResults = await Promise.all(search.results.slice(0, 5).map(r => r.data()));
    logData(filters, fiveResults);
  }
  
    asyncCall();