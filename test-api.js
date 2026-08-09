import fetch from 'node-fetch';

const testData = {
  budget: 100000000,
  popularity: 80,
  runtime: 120,
  vote_average: 7.2,
  vote_count: 1500,
  genre: "Action"
};

async function testPredictionAPI() {
  try {
    const response = await fetch('http://localhost:8085/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    console.log('API Response:', result);
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testPredictionAPI();