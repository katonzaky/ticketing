import axios from 'axios';

const buildClient = ({ req }) => {
	if (typeof window === 'undefined') {
		// Inside the server

		return axios.create({
			baseURL: 'http://ticketing-app.live/',
			headers: req.headers,
		});
	} else {
		// Inside the browser

		return axios.create({
			baseURL: '/',
		});
	}
};

export default buildClient;
