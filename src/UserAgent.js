import randomUseragent from 'random-useragent';

const generateUseragent = () => {
  const useragent = randomUseragent.getRandom();

  return useragent;
};

export default generateUseragent;
