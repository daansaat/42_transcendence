import axios, { AxiosResponse } from 'axios';

export async function fetchData(path: string): Promise<any> {
  try {
    const url = 'http://f1r1s3.codam.nl:3001/' + path
    // console.log(url)
    const response = await axios.get( url, { withCredentials: true });
    // console.log(JSON.stringify(response.data))
    return JSON.stringify(response.data);
  }  catch (error) {
        console.error('Error message:', error);
    // console.error('Error message:', error.message);
    // console.error('Error name:', error.name);
    // console.error('Error stack trace:', error.stack);
    throw new Error('An error occurred while fetching data.');
  }
}
