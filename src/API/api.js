
import axios from 'axios';

async function getProjectList(options) {
	const data = await axios.post('/api/getList',options)
    .then( result => {
        // this is what const data will be set to
        return {
            success: true,
            result: result,
        }
    })
    .catch(error => {
        console.log('API ERROR',error)
        return {error: error}
    })
    return data;
}

async function postLogEntries(options) {
	const data = await axios.post('/api/post',options)
    .then( result => {
        return {
            success: true,
        }
    })
    .catch(error => {
        console.log('API ERROR',error)
        return {error: error}
    })
    return data;
}

export {getProjectList,postLogEntries}
