import axios from 'axios';
const API_URL = 'http://localhost:3000';

const getEmployee = async () => {
    const url = `${API_URL}/employee`;
    const res = await axios.get(url).then(response => response.data);
    // eslint-disable-next-line no-console
    //console.log(res)
}

export default getEmployee