(() => {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input === '/v3/data/graph.json') {
      const graphUrl = new URL('../../v3/data/graph.json', document.baseURI);
      return nativeFetch(graphUrl, init);
    }
    return nativeFetch(input, init);
  };
})();
